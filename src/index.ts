import express from "express";
import config from "./config/config";
// import prisma from './database'

const app = express();

app.listen(config.serverPort, () => {
  console.log(`Server is running on http://localhost:${config.serverPort}`);
});
