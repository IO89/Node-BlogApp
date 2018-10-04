jest.setTimeout(10000);

require('../models/User');

const mongoose = require('mongoose');
const keys =require('../config/keys');

// Overriding to use node promise
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, {useMongoClient:true});