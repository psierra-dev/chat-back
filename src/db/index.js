require("dotenv").config();
function connectMongoDB(mongoose) {
  console.log(process.env.DB_URL, "DB_URL");
  const uri = process.env.DB_URL;
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

module.exports = { connectMongoDB };
