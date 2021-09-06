const mongoose = require('mongoose');

// Setting variables
mongoAddr = process.env.MONGO_ADDR || '192.168.4.231'
mongoDBS = process.env.MONGO_DBS || 'ConfigService'
loyaltyDBS = process.env.LOYALTY_DBS || 'loyalty'

// Setting instance parameters
const mongoUri = 'mongodb://' + mongoAddr + '/' + mongoDBS;
console.log('MongoDB address set to:', mongoUri);

const loyaltyUri = 'mongodb://' + mongoAddr + '/' + loyaltyDBS;
console.log('MongoDB loyalty address set to:', loyaltyUri);

// Setting mongoose parameters
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: false, // Don't build indexes
    poolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 10000, // Close sockets after 10 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
};

mongoose.connect(mongoUri, options);

const loyaltyConn = mongoose.createConnection(loyaltyUri, options);
module.exports = loyaltyConn;