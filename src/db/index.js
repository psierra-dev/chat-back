const config = require("../config");

require("dotenv").config();
function connectMongoDB(mongoose) {
  const uri = config.db_url;
  mongoose
    .connect(uri, {})
    .then(() => {
      console.log("Conectado a MongoDB");
    })
    .catch((error) => {
      console.log("Error al conectar a Mongo DB", error);
    });

  mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to " + uri);
  });

  mongoose.connection.on("error", (err) => {
    console.error("Mongoose connection error: " + err);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected");
  });
}

module.exports = {connectMongoDB};
