const express = require('express');
const router = express.Router();
const convert = require('xml-js');

// Logs models
const Log = require('../models/Log');

import covid19ImpactEstimator from '../../src/estimator';

router.post("/:reponseType?", (req, res, next) => {
    const data = req.body;
    const impact = covid19ImpactEstimator(data);

    if(req.params.reponseType == "xml") {
        var result = convert.js2xml(impact, {compact: true, spaces: 4});
        // Set the header to xml type
        res.type('application/xml');
        return res.status(200).send(result);
    }
    return res.status(200).json(impact);
});

router.get("/logs", (req, res, next) => {
    Log.find({}).exec()
    .then(logs => {
        let logsText = "";
        logs.forEach(raw => {
            logsText += raw.log+"\n"
        });
        res.header({'Content-Type': 'text/plain;charset=utf-8'})
        res.status(200).send(logsText)
    })
    .catch(err => {
        return res.status(500).send(err);
    })
});

module.exports = router;