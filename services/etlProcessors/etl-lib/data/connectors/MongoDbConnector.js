
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

class MongoDbConnector {
    constructor(connectionString, options = null) {
        this.db = {}
        this.db.connectionString = connectionString
        this.db.mongoose = mongoose;
        this.options = options || {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    }

    async openConnection() {
        return new Promise((resolve, reject) => {
            this.db.mongoose.connect(this.db.connectionString, this.options)
                .then(async () => {
                    console.log("Connected to the database!");
                    resolve()
                })
                .catch(err => {
                    console.log("Cannot connect to the database!", err);
                    reject('Cannot connect to the database!')
                });
        })
    }
};

module.exports = { MongoDbConnector }