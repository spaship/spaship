const mongoose = require("mongoose");
//const { log } = require("@spaship/common/lib/logging/pino");
const config = require("./config");

const uri = `mongodb://${config.get("db:mongo:url")}/${config.get("db:mongo:db_name")}`;

const connect = async () => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  };
  config.get("db:mongo:user") && (options.user = config.get("db:mongo:user"));
  config.get("db:mongo:password") && (options.pass = config.get("db:mongo:password"));
  await mongoose.connect(uri, options);
  const spashipSchema = ['events', 'eventtimetraces', 'websites'];
  mongoose.connection.db.listCollections().toArray(function (err, collectionNames) {
    if (err) {
      console.log(err);
      return;
    }
    const schemaList = [];
    collectionNames.forEach(function (schema) {
      schemaList.push(schema.name);
    });
    console.log('Schemas present in the Database : ', schemaList.toString());
    spashipSchema.forEach(function (schema) {
      if (!schemaList.includes(schema)) {
        console.log(`${schema} is not present in Database`);
        mongoose.connection.db.createCollection(schema);
        console.log(`Schema Created successfully`);
      }
    });
  });
};

mongoose.connection.on("connected", function () {
  console.log("Mongoose default connection is open to ", uri);
});

mongoose.connection.on("error", function (err) {
  console.log("Mongoose default connection has occured " + err + " error");
});

mongoose.connection.on("disconnected", function () {
  console.log("Mongoose default connection is disconnected");
});

module.exports = {
  connect,
};
