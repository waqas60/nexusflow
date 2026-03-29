import express from "express";
import connectToDB from "./config.js";
import authRouter from "./routes/auth/route.js";
import organizationRouter from "./routes/organization/route.js";
import boardRouter from "./routes/board/route.js";
const app = express();
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/organization", organizationRouter);
app.use("/api/board", boardRouter);

app.listen(3000, async () => {
  await connectToDB();
  console.log("Server running on http://localhost:3000");
});
