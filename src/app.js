const express = require("express");

// connecting to mongoose.js so that app connects to the database
require("./db/mongoose.js");

const app = express();

app.use(express.json());

// Importing routers
const userRouter = require("./routers/user-router");
app.use(userRouter);

const taskRouter = require("./routers/task-router");
app.use(taskRouter);



module.exports = app;
