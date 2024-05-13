import React, { useState, useEffect, Suspense, Fragment, useRef } from 'react';
import { useFlag, useVariant, useUnleashContext } from '@unleash/proxy-client-react';
import Switch from '@mui/material/Switch';
import HeaderMFE from './components/DynamicRemoteMFE';

function useFlagStatus({ featureName, feature, variantList, handleDevelopmentChange, enabledDev }) {
    const checkEnabled = useFlag(featureName) ? true : false;
    const [divArray, setDivArray] = useState([]);

    useEffect(() => {
        var divArray = <div key={`${feature.name}-${Math.random()}`} className='flexStyle'>
            <div className='col-2 individualUI' key={`${feature.name}-${Math.random()}`}>{feature.name}</div>
            {variantList.length > 0 && (variantList.map((data, index) => {
                if (feature.name == data.name) {
                    return (
                        <Suspense fallback={'Loading . . . '}>
                            <div className="col-7 individualUI" key={`${feature.name}-${Math.random()}`}>
                                {/* {checkEnabled ? */}
                                <HeaderMFE key={`${feature.name}-${Math.random()}`} url={data.dev_url + '/remoteEntry.js'} scope={data.scope} module={data.module} />
                                {/* :
                                <div> Enable To View {feature.name} Component</div>}                                         */}
                            </div>
                        </Suspense>

                    )
                }

            }))

            }

            <div className='gridStyle col-3 individualUI' key={`${feature.name}-${Math.random()}`}>
                <div key={`${feature.name}-${Math.random()}`}>{enabledDev ? "ON" : "OFF"}</div>
                <Switch
                    checked={enabledDev}
                    onChange={handleDevelopmentChange}
                    inputProps={{ 'aria-label': 'controlled', 'name': feature.name, }}
                    key={`${feature.name}-${Math.random()}`}
                />

            </div>

        </div>
        setDivArray(divArray)

    }, [enabledDev])

    useEffect(() => {
        var divArray = <div key={`${feature.name}-${Math.random()}`} className='flexStyle'>
            <div className='col-2 individualUI' key={`${feature.name}-${Math.random()}`}>{feature.name}</div>
            {variantList.length > 0 && (variantList.map((data, index) => {
                if (feature.name == data.name) {
                    return (
                        <Suspense fallback={'Loading . . . '}>
                            <div className="col-7 individualUI" key={`${feature.name}-${Math.random()}`}>
                                {/* {checkEnabled ? */}
                                <HeaderMFE key={`${feature.name}-${Math.random()}`} url={data.dev_url + '/remoteEntry.js'} scope={data.scope} module={data.module} />
                                {/* :
                                <div> Enable To View {feature.name} Component</div>}                                         */}
                            </div>
                        </Suspense>

                    )
                }

            }))

            }

            <div className='gridStyle col-3 individualUI' key={`${feature.name}-${Math.random()}`}>
                <div key={`${feature.name}-${Math.random()}`}>{checkEnabled ? "ON" : "OFF"}</div>
                <Switch
                    checked={checkEnabled}
                    onChange={handleDevelopmentChange}
                    inputProps={{ 'aria-label': 'controlled', 'name': feature.name, }}
                    key={`${feature.name}-${Math.random()}`}
                />

            </div>

        </div>
        setDivArray(divArray)

    }, [checkEnabled])


    return (
        <Fragment>
            {divArray && divArray}
        </Fragment>
    )
}




export default useFlagStatus;