const Agenda = require("agenda");
const config = require("./config");
const uri = `mongodb://${config.get("db:mongo:url")}`;

const agenda = new Agenda({
  db: { address: uri, collection: 'agenda' },
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = {
  agenda
};
