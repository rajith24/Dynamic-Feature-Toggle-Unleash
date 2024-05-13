import React, { createContext, useContext, Suspense, useState, useEffect, useRef, Fragment } from 'react'
import './App.css';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, Navigate, Redirect } from 'react-router-dom';
import Keycloak from 'keycloak-js';
import { jwtDecode } from 'jsonwebtoken';
import Development from "./Development";
import Production from "./Production";
import CustomTheme from './setTheme'


import { FlagProvider } from '@unleash/proxy-client-react';

var passwordDev = process.env.REACT_APP_UNLEASH_DEVELOPMENT_PASSWORD
var passwordProd = process.env.REACT_APP_UNLEASH_PRODUCTION_PASSWORD



const configDev = {
  url: process.env.REACT_APP_UNLEASH_URL + '/api/frontend', // Your front-end API URL or the Unleash proxy's URL (https://<proxy-url>/proxy)
  clientKey: passwordDev, // A client-side API token OR one of your proxy's designated client keys (previously known as proxy secrets)
  refreshInterval: 1, // How often (in seconds) the client should poll the proxy for updates
  appName: 'mfe-template', // The name of your application. It's only used for identifying your application
};

const configProd = {
  url: process.env.REACT_APP_UNLEASH_URL + '/api/frontend', // Your front-end API URL or the Unleash proxy's URL (https://<proxy-url>/proxy)
  clientKey: passwordProd, // A client-side API token OR one of your proxy's designated client keys (previously known as proxy secrets)
  refreshInterval: 1, // How often (in seconds) the client should poll the proxy for updates
  appName: 'mfe-template', // The name of your application. It's only used for identifying your application
};


const keycloakConfig = {
  url: 'your keycloak url',
  realm: 'your keycloak realm',
  clientId: 'your keycloak clientId',
};

const keycloakInt = new Keycloak(keycloakConfig);


function App({ route }) {

  const navigate = useNavigate();
  const [choice, setChoice] = useState(route);
  const [isKeycloakInitialized, setIsKeycloakInitialized] = useState(false);
  const isRun = useRef(false);
  const [uuid, setUuid] = useState('');
  const [userInfo, setUserInfo] = useState({
    uuid: '',
    name: '',
    email: '',
    shortName: '',
    handleLogout: () => { },
  });

  const [isLoading, setLoading] = useState(true);
  const [isEmployee, setEmployee] = useState(false);

  const[isActive, setIsActive] = useState(true)

  useEffect(() => {
    const initializeKeycloak = async () => {
      try {
        if (isRun.current) return;
        const authenticated = await keycloakInt.init({ onLoad: 'login-required' });
        setIsKeycloakInitialized(true);
        if (authenticated) {
          const decodedToken = jwtDecode(keycloakInt.token);
          if (decodedToken.realm_access.roles.includes("default-roles-tbb_platform")) {
            setLoading(false);
            setEmployee(true)
          }
          isRun.current = true;
        } else {
          console.log('User is not authenticated');
        }
      } catch (error) {
        console.error('Keycloak initialization error', error);
        setLoading(false);
      }
    };

    initializeKeycloak();
    if(choice != "Development"){
      setIsActive(!isActive)
    }
  }, [choice])


  const handleChange = (e) => {
    setChoice(e.target.innerText)
    if(e.target.innerText != choice) setIsActive(!isActive)
    navigate('/' + String(e.target.innerText).toLowerCase())

  }
  return (
    <Fragment>
      <CustomTheme/>

        {isEmployee &&
          <Fragment>
            <div className="UnleashApp">
              <div className='flexStyle' style={{zIndex: 10}}>
                <div className='col-2 individualUI'></div>
                <div className={"AppNavHeader col-7 individualUI"} style={{
                  display: "flex",
                  // position: "sticky", 
                  top: 0, zIndex: 100,
                  // height:"10%" 
                }}>
                  <DropdownButton id="dropdown-basic-button" title={choice}>
                    <Dropdown.Item onClick={handleChange} active={(choice == "Development" && route == "Development") ? true : false}>Development</Dropdown.Item>
                    <Dropdown.Item onClick={handleChange} active={(choice == "Production" && route == "Production") ? true : false}>Production</Dropdown.Item>
                  </DropdownButton>
                </div>
                <div className='col-3 individualUI'></div>
              </div>
            

              {(choice == "Development" && route == "Development") ?
                <>
                  <FlagProvider config={configDev}>
                    <Development featureConfig={configDev} setChoice={setChoice}/>
                  </FlagProvider>
                </>
                :
                <>
                  <FlagProvider config={configProd}>
                    <Production featureConfig={configProd} setChoice={setChoice}/>
                  </FlagProvider>
                </>
              }
            </div>
          </Fragment>

        }

      {/* </CustomTheme> */}

    </Fragment>


  );
}

export default App;
