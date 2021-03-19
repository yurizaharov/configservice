const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const configsSchema = new Schema();

// Setting variables
mongoAddr = process.env.MONGO_ADDR || 'localhost'
mongoDBS = process.env.MONGO_DBS || 'ConfigService'

// Setting instance parameters
const mongoUri = "mongodb://" + mongoAddr + "/" + mongoDBS;
console.log("MongoDB address set to:", mongoUri);

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

module.exports = {

    getall: async function () {
        let result = [];

        const Total = mongoose.model('', configsSchema, 'configs');

        result = await Total.find({ "test" : true }, function (err, doc){
//        result = await Total.find( { "test" : true }, function (err, doc){
            if(err) return console.log(err);
        }).sort({ 'name' : 1 }).lean();

        return result;
    },

    getstatsender: async function () {
        let result = [];

        const Stats = mongoose.model('', configsSchema, 'configs');

        result = await Stats.find({ "subscription" : false, "inProd" : true }, function (err, doc){
            if(err) return console.log(err);
        }).sort({ 'name' : 1 }).lean();

        return result;
    }

}
