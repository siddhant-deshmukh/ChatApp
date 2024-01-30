import app from "./app"

import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config();

const port = process.env.PORT || 5000;

if (process.env.NODE_ENV != "test") {
  mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)
    .then((mong) => { console.log("Connected to database", mong.connection.id) })
    .catch((err) => { console.error("Unable to connect database", err) })
} else {
  mongoose.connect(process.env.TEST_MONGODB_CONNECTION_STRING as string)
    .then((mong) => { console.log("Connected to database", mong.connection.id) })
    .catch((err) => { console.error("Unable to connect database", err) })
}

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});