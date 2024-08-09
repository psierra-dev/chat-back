const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const config = require("../config");
const UserService = require("../service/UserService");

function createExpressApp(db) {
  const app = express();

  const allowlist = [config.client_url];

  let corsOptionsDelegate = function (req, callback) {
    let corsOptions;
    if (allowlist.indexOf(req.header("Origin")) !== -1) {
      corsOptions = {origin: true};
    } else {
      corsOptions = {origin: false};
    }
    callback(null, corsOptions);
  };
  app.use(cors(corsOptionsDelegate));
  app.use(express.urlencoded({extended: true}));
  app.use(express.json());
  app.use(cookieParser());
  app.use(morgan("dev"));

  const userService = new UserService(db);

  app.post("/login", async (req, res) => {
    const data = req.body;
    console.log(data, "data");

    try {
      const isUsed = await userService.findOne({username: data.username});

      if (isUsed) {
        return res.status(400).send("username en uso");
      }

      res.status(200).send("ready");
    } catch (error) {
      console.log(error, "--error");

      res.status(500).send(error);
    }
  });
  return app;
}

module.exports = createExpressApp;
