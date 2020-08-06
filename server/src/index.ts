import dotenv from "dotenv";
import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import { initializeConfig, getConfig } from "@ckb-lumos/config-manager";
import { IndexerService } from "./services/IndexerService";
import { RPC } from "ckb-js-toolkit";

dotenv.config();
initializeConfig();

import indexerRoutes from "./routes/indexer";
import ckbRoutes from "./routes/ckb";

export const rpc = new RPC(process.env.RPC_URL);
export const indexerService = new IndexerService(process.env.RPC_URL, process.env.INDEXER_DATA_DIR);

const app = express();
app.use(bodyParser.json());

// Allow CORS for localhost
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Routes
app.use("/indexer", indexerRoutes);
app.use("/ckb", ckbRoutes);

app.listen(process.env.PORT, () => {
  indexerService.indexer.startForever();
  console.log(`token-mint-server listening on port ${process.env.PORT}`);
});
