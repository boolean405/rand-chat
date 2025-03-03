require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const { accountDbConnection, appDbConnection } = require("./utils/db");
const { Token } = require("./utils/core");
const Redis = require("./utils/redis");
// const { Migrator } = require("./migrations/migrator");
const { errorHandler, notFound } = require("./middleware/error-middleware");

const userRoute = require("./routes/user-route");
const chatRoute = require("./routes/chat-route");
const messageRoute = require("./routes/message-route");
// const path = require("path");

// variables
const port = process.env.PORT || 3000;

// Deploy on server
// app.use(express.static(path.join(__dirname, "/client/dist")));
// app.get("*", (req, res) =>
//   res.sendFile(path.join(__dirname, "/client/dist/index.html"))
// );
// Deploy on server

// Middleware
app.use(express.json());

// Main Function
// Connect db and run server
const runServer = () => {
  accountDbConnection.once("open", () => {
    appDbConnection.once("open", () => {
      console.log("=> Success, connected to Account database");
      console.log("=> Success, connected to App database");
      app.listen(port, console.log(`=> Server is running at port ${port}`));
    });
  });
};
// Migrate Data
//   await Migrator.migrate();
// })
//   // Backup Data
//   await Migrator.backup();

// Run Server
runServer();

// Routes
app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);

app.use(notFound);
app.use(errorHandler);

// Socket.io Chatting
io.of("api/chat")
  .use(async (socket, next) => {
    try {
      let token = socket.handshake.query.token;
      if (!token) {
        next(new Error("Need authorization"));
        return;
      }
      let decoded = Token.verifyToken(token);
      let user = await Redis.get(decoded.id);
      if (!user) {
        next(new Error("Need to relogin"));
        return;
      }
      socket.userData = user;
      next();
    } catch (err) {
      const error = new Error(err.message);
      error.status = 401;
      return next(error);
    }
  })
  .on("connection", (socket) => {
    require("./chat/chat").initialize(io, socket);
  });
