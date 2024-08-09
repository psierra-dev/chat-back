require("dotenv").config();
module.exports = {
  client_url: process.env.CLIENT_URL,
  port: process.env.PORT || 3001,
  db_url: process.env.DB_URL,
};
