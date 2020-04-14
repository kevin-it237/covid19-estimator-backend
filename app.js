const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose');

const routes = require('./api/routes/estimator');

// Log Model
const Log = require('./api/models/Log');

// Connect to db
const dbURI = "mongodb://covid19-admin:covid19-admin@ds135427.mlab.com:35427/covid19-estimator"
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function() {
    console.log('Connected to mongodb');
})

let app = express();
app.use(express.json());

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

// Set cors policy
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-Type, Accept, Content-Type, Authorization')
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next()
})

// Get all requests and save in the database
app.use((req, res, next) => {
    let timestamp = Math.floor(new Date().getTime() / 1000);
    let time = (new Date().getTime() - new Date(req._startTime).getTime()) / 1000;
    let logLine = `${timestamp}\t\t${req.originalUrl.substring(7)}\t\t done in ${time.toFixed(2)} seconds`;
    const log = new Log({ log: logLine });

    log.save()
    .then(log => {
        next();
    })
    .catch(err => {
        res.status(500).json({ error: err });
    })
})

// Routes
app.use('/api/v1/on-covid-19', routes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running on port 3000");
});