import express from "express";
import bodyParser from "body-parser";
import configViewEngine from "./config/viewEngine";
import initWebRouter from "./route/web";
import connectDB from "./config/connectDB";
require("dotenv").config();
import cors from "cors";

let app = express();
app.use(cors({ origin: true }));

// app config
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

configViewEngine(app);
initWebRouter(app);

connectDB();

let port = process.env.PORT || 6969;

app.listen(port, () => {
  console.log("BackEnd NodeJs is running on port: " + port);
});
