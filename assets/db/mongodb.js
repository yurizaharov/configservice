const mongoose = require('mongoose');
const options = require('../../db/mongodboptions')

mongoose.set('strictQuery', false);

// Setting variables
mongoAddr = process.env.MONGO_ADDR || '192.168.4.231'
mongoDBS = process.env.MONGO_DBS || 'ConfigService'

// Setting instance parameters
const mongoUri = `mongodb://${mongoAddr}/${mongoDBS}`;
console.log('MongoDB address set to:', mongoUri);

const mongoConn = mongoose.createConnection(mongoUri, options);
module.exports = mongoConn;