import express from "express";
import {indexerService} from "../index";

const routes = express.Router();

routes.post("/get-cells", (req: any, res) => {
  indexerService.collectCells(req.body).then((cells) => {
    return res.json(JSON.stringify(cells));
  });
});

export default routes;
