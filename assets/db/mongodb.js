const mongoose = require('mongoose');
const options = require('../../db/mongodboptions')
const logger = require('../../common/logger');

mongoose.set('strictQuery', false);

// Setting variables
mongoAddr = process.env.MONGO_ADDR || '192.168.4.231'
mongoDBS = process.env.MONGO_DBS || 'ConfigService'

// Setting instance parameters
const mongoUri = `mongodb://${mongoAddr}/${mongoDBS}`;
logger.info('MongoDB address set to: %s', mongoUri);

const mongoConn = mongoose.createConnection(mongoUri, options);
module.exports = mongoConn;