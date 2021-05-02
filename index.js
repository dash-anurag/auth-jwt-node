const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 8080;

//* Import Routes
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

dotenv.config();

//* Connect to DB
mongoose.connect(
  process.env.DB_CONNECT,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Connected to DB!");
  }
);

//* Middleware
app.use(express.json());

//* Route Middleware
app.use("/api/user", authRoute);
app.use("/api/posts", postRoute);

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
