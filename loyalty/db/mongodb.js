const mongoose = require('mongoose');
const options = require('../../db/mongodboptions')
const logger = require('../../common/logger');

mongoose.set('strictQuery', false);

// Setting variables
loyaltyMongoAddr = process.env.LOYALTY_MONGO_ADDR || '192.168.4.231'
loyaltyDBS = process.env.LOYALTY_DBS || 'loyalty'

// Setting instance parameters
const loyaltyUri = `mongodb://${loyaltyMongoAddr}/${loyaltyDBS}`;
logger.info('MongoDB loyalty address set to: %s', loyaltyUri);

const loyaltyConn = mongoose.createConnection(loyaltyUri, options);
module.exports = loyaltyConn;