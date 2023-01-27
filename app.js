const express = require("express");
const app = express();
const dotenv = require("dotenv").config();

const connectDB = require("./db/connectDB");

// middlewares
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// routes
const authRouter = require("./routes/authRoutes");

app.use(express.json());

app.use("/api/v1/auth", authRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
