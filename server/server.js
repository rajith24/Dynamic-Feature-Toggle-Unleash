const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();

const { initialize } = require('unleash-client');

let password = ""
if (process.env.REACT_APP_ENV == 'production') {
    password = process.env.REACT_APP_UNLEASH_PRODUCTION_PASSWORD
}
else {
    password = process.env.REACT_APP_UNLEASH_DEVELOPMENT_PASSWORD
}


// const unleash = initialize({
//   url: process.env.REACT_APP_UNLEASH_URL,
//   appName: 'mfe-featureToggle',
//   customHeaders: { Authorization: password },
// });

app.use(cors());
app.use(bodyParser.json());

// Allow all origins
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

app.use(express.json());

app.get('/api/getAllfeatures', async (req, res) => {
    try {

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${process.env.REACT_APP_UNLEASH_URL}/api/admin/projects/default/features`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `${process.env.REACT_APP_UNLEASH_UNIVERSAL_API_TOKEN}`
            }
        };

        axios(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                res.status(200).json(response.data);

            })
            .catch((error) => {
                console.log(error);
            });

    } catch (error) {
        console.error('Error creating token:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/getSprecificFeature', async (req, res) => {
    try {

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${process.env.REACT_APP_UNLEASH_URL}/api/admin/projects/default/features/${req.body.featureName}`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `${process.env.REACT_APP_UNLEASH_UNIVERSAL_API_TOKEN}`
            }
        };

        axios(config)
            .then((response) => {
                // console.log(JSON.stringify(response.data));
                res.status(200).json(response.data);

            })
            .catch((error) => {
                console.log(error);
            });

    } catch (error) {
        console.error('Error creating token:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/getVariants', async (req, res) => {
    try {

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${process.env.REACT_APP_UNLEASH_URL}/api/admin/projects/default/features/${req.body.featureName}/environments/${req.body.environment}/variants`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `${process.env.REACT_APP_UNLEASH_UNIVERSAL_API_TOKEN}`
            }
        };

        axios(config)
            .then((response) => {
                // console.log(JSON.stringify(response.data));
                res.status(200).json(response.data);

            })
            .catch((error) => {
                console.log(error);
            });

    } catch (error) {
        console.error('Error creating token:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/controlFeatureToggle', async (req, res) => {
    try {
        // You can perform any necessary processing here
        if (req.body.isEnabled != "") {
            // Send a response back to the client
            // console.log(req.body)
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${process.env.REACT_APP_UNLEASH_URL}/api/admin/projects/default/features/${req.body.featureName}/environments/${req.body.environment}/${req.body.isEnabled}`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `${process.env.REACT_APP_UNLEASH_UNIVERSAL_API_TOKEN}`
                }
            };

            axios(config)
                .then((response) => {
                    // console.log(JSON.stringify(response.data));
                    res.status(200).json("Changed");
                })
                .catch((error) => {
                    console.log(error);
                    res.status(200).json("Not Changed");
                });

        }

    } catch (error) {
        console.error('Error creating token:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/getChangeRequest', async (req, res) => {
    try {
        // You can perform any necessary processing here
        // if (req.body != "") {
            // Send a response back to the client
            // console.log(req.body)
            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `${process.env.REACT_APP_UNLEASH_URL}/api/admin/projects/default/change-requests/scheduled`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `${process.env.REACT_APP_UNLEASH_UNIVERSAL_API_TOKEN}`
                }
            };

            axios(config)
                .then((response) => {
                    // console.log(JSON.stringify(response.data));
                    res.status(200).json(response.data);
                })
                .catch((error) => {
                    console.log(error);
                    res.status(200).json("Not Changed");
                });

        // }

    } catch (error) {
        console.error('Error creating token:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
