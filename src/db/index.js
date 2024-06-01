function connectMongoDB(mongoose) {
  mongoose
    .connect(process.env.DB_URL, {})
    .then(() => {
      console.log("Conectado a MongoDB");
    })
    .catch((error) => {
      console.log("Error al conectar a Mongo DB", error);
    });
}

module.exports = { connectMongoDB };
