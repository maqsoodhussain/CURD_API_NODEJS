const express = require("express");
const app = express();


const mySqlPool = require("./config/db");

const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");


dotenv.config();
app.use(morgan("dev"));
app.use(express.json());

//routes
app.use("/api/v1/users",require("./routes/usersRoutes"))
// app.use("/get",require("./routes/usersRoutes"))

app.get("/", (req, res) => {
  res.status(200).send("API WORKING");
});

const PORT = process.env.PORT || 3000;

mySqlPool.query("SELECT 1").then(() => {
  console.log("DATABASE CONNECTED".bgYellow);
  app.listen(PORT, () => {
    console.log(` app listening on port ${PORT}`.bgGreen);
  });
}).catch((error) => {
  console.log(error);
});
