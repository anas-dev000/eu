import express from "express";
import cors from "cors";
import apiRoutes from "./routes/api.js";
import path from "path";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api", apiRoutes);

app.use("/assets", express.static(path.join(process.cwd(), "public")));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
