// index.js

import express from "express";
import { fetchMenuItems } from "./models/menu-model.js";
import { menuRouter } from "./routes/menu-router.js";
import { userRouter } from "./routes/user-routes.js";
import authRouter from "./routes/auth-router.js";
import cors from "cors";
import { notFoundHandler, errorHandler } from "./middlewares/error-handler.js";
//
const hostname = "127.0.0.1";
const app = express();
const port = 3000;

// app.set("view engine", "pug");
// app.set("views", "src/views");
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To parse application/x-www-form-urlencoded
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use("/api", express.static("doc"));
app.use(cors());

app.get("/api", async (req, res) => {
  res.render("index", {
    title: "API documentation",
    massage: "something",
    mediaData: await fetchMenuItems(),
  });
});

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
