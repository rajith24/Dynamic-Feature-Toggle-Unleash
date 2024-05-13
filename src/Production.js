import React, { useState, useEffect, Suspense, Fragment, useRef } from 'react';
import { useFlag, useVariant, useUnleashContext } from '@unleash/proxy-client-react';
import axios from "axios";
import LoadingIcon from './components/Loading/loading';
import FlagStatusCheck from './prodFlagStatus';
import { FlagProvider } from '@unleash/proxy-client-react';

var runtime = process.env.REACT_APP_RUNTIME
var runtimeURL =""
if(runtime == "development"){
    runtimeURL = process.env.REACT_APP_RUNTIME_DEV_URL
}
else{
    runtimeURL = process.env.REACT_APP_RUNTIME_PROD_URL
}

function LoadVariants({ featureConfig }) {
    const [variantList, setVariants] = useState([]);
    const [divArray, setDivArray] = useState([]);
    const [feature, setfeature] = useState({});
    const [devLoading, setDevLoading] = useState(true);
    const featuresArrRef = useRef([]);


    const variant = useVariant("testVariant");

    const handleProductionChange = async (e) => {
        try {
            var featureNameRes = e.target.name
            var developmentEnabled = e.target.checked;
            Promise.all(feature.data.features.map(async (feature, index) => {
                if (feature.name == featureNameRes) {
                    feature.environments[1].enabled = developmentEnabled
                }
            }))
                .then(() => {
                    setfeature(feature)
                    updateDynamicComp(feature)
                })

            const text = e.target.checked ? "on" : "off";
            const response = await axios.post(`${runtimeURL}/api/controlFeatureToggle`, {
                environment: "production",
                isEnabled: text,
                featureName: e.target.name
            })

        } catch (error) {
            console.error('Error fetching feature toggle:', error);
        }
    }

    const loadAllFeatures = async (e) => {
        try {

            let variantListArr = []
            let envArr = []
            const response = await axios.get(`${runtimeURL}/api/getAllfeatures`)
            // .then((response)=>{
            if (response.data != undefined) {
                setfeature(response)
                Promise.all(response.data.features.map(async (feature, index) => {
                    if (feature.environments != undefined) {
                        feature.environments.map((data, index) => {
                            envArr.push(data)
                        })
                    }
                    const variant = await axios.post(`${runtimeURL}/api/getVariants`, {
                        environment: "production",
                        featureName: feature.name,
                    })

                    if (variant.data != undefined) {
                        variant.data.variants.map((data, index) => {
                            if (data.payload.value != undefined && data.name == "configVariant") {
                                variantListArr.push(JSON.parse(data.payload.value))
                            }
                        })

                    }

                }))
                    .then(() => {
                        featuresArrRef.current = envArr
                        setVariants(variantListArr)
                    })
            }
        } catch (error) {
            console.error('Error fetching feature toggle:', error);
        }
    }

    useEffect(() => {
        loadAllFeatures()
    }, [featureConfig])

    useEffect(() => {
        const loadDynamicComp = async (e) => {

            const newDivArray = await Promise.all(feature.data.features.map(async (feature, index) => {


                return (
                    <FlagProvider config={featureConfig}>

                        <FlagStatusCheck featureName={feature.name} feature={feature}
                            variantList={variantList} handleProductionChange={handleProductionChange} />
                    </FlagProvider>

                )


            }));

            setDivArray(newDivArray);
            setDevLoading(false)

        }
        if (feature.data != undefined) loadDynamicComp()
    }, [variantList])

    const updateDynamicComp = async (duplicatedArray) => {


        const newDivArray = await Promise.all(duplicatedArray.data.features.map(async (feature, index) => {


            return (
                <FlagProvider config={featureConfig}>

                    <FlagStatusCheck featureName={feature.name} feature={feature}
                        variantList={variantList} handleProductionChange={handleProductionChange} enabledProd={feature.environments[1].enabled} />
                </FlagProvider>

            )


        }));

        setDivArray(newDivArray);
        setDevLoading(false)
    }



    return (
        <Fragment>
            <React.Suspense fallback={<LoadingIcon />}>
                {devLoading ? <LoadingIcon customClassName={"loadingDivMain"} /> : divArray}
            </React.Suspense>
        </Fragment>


    )



}

export default LoadVariants