import express from "express";
import connectToDB from "./config/db.config.js";
import { UserRouter, OrganizationRouter, BoardRouter, CardRouter } from "./routes/index.js";
const app = express();
app.use(express.json());

app.use("/api/auth", UserRouter);
app.use("/api/organization", OrganizationRouter);
app.use("/api/board", BoardRouter);
app.use("/api/card", CardRouter);

app.listen(3000, async () => {
  await connectToDB();
  console.log("Server running on http://localhost:3000");
});
