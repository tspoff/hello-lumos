import express from "express";
import { rpc } from "../index";
import { Hash } from "@ckb-lumos/base";

const routes = express.Router();

const fetchTransactionStatus = async (txHash: Hash) => {
  const tx = await rpc.get_transaction(txHash);
  return tx.tx_status.status;
};

routes.get("/latest-block", async (req, res) => {
  try {
    const latest = await rpc.get_tip_block_number();
    return res.status(200).json(JSON.stringify({ blockNumber: latest }));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

routes.post("/fetch-tx-status", async (req: any, res) => {
  try {
    const { txHashes } = req.body;
    const txStatuses = {};
    for (const txHash of txHashes) {
      const status = await fetchTransactionStatus(txHash);
      txStatuses[txHash] = status;
    }
    return res.status(200).json(JSON.stringify({ txStatuses }));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

export default routes;
