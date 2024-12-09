// index.js

import express from "express";
import { menuRouter } from "./routes/menu-router.js";
import { userRouter } from "./routes/user-routes.js";
import authRouter from "./routes/auth-router.js";
import cors from "cors";
import { notFoundHandler, errorHandler } from "./middlewares/error-handler.js";
//
const hostname = "127.0.0.1";
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To parse application/x-www-form-urlencoded
app.use(express.static("public"));
app.use(cors());

app.use("/", express.static("public/index.html"));

app.use("/api", express.static("doc"));

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/menu", menuRouter);
// Default for all routes not handled by routers above
app.use(notFoundHandler);
// Add error handler middleware as the last middleware in the chain
app.use(errorHandler);

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
