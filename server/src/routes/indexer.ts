import express from "express";
import { indexer } from "../index";
import { Cell } from "@ckb-lumos/base";

const routes = express.Router();

routes.post("/get-cells", async (req: any, res) => {
  const collector = indexer.collector(req.body);

  const cells: Cell[] = [];
  for await (const cell of collector.collect()) {
    cells.push(cell);
  }

  return res.json(JSON.stringify(cells));
});

export default routes;
