const mongoose = require('mongoose');
const options = require('../../db/mongodboptions')

// Setting variables
loyaltyMongoAddr = process.env.LOYALTY_MONGO_ADDR || '192.168.4.231'
loyaltyDBS = process.env.LOYALTY_DBS || 'loyalty'

// Setting instance parameters
const loyaltyUri = `mongodb://${loyaltyMongoAddr}/${loyaltyDBS}`;
console.log('MongoDB loyalty address set to:', loyaltyUri);

const loyaltyConn = mongoose.createConnection(loyaltyUri, options);
module.exports = loyaltyConn;