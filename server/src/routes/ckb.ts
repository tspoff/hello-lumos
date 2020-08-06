import express from "express";
import { indexerService, rpc } from "../index";
import { Script } from "@ckb-lumos/base";
import { common, secp256k1Blake160 } from "@ckb-lumos/common-scripts";
import { TransactionSkeleton, sealTransaction } from "@ckb-lumos/helpers";

interface CkbTransferParams {
  sender: string;
  recipient: string;
  amount: string;
  txFee: string;
}

const routes = express.Router();

const buildTransferCkbTx = async (params: CkbTransferParams) => {
  const { sender, amount, recipient, txFee } = params;

  let txSkeleton = TransactionSkeleton({
    // @ts-ignore
    cellProvider: indexerService.indexer,
  });

  txSkeleton = await secp256k1Blake160.transfer(
    txSkeleton,
    sender,
    recipient,
    BigInt(amount)
  );
  txSkeleton = await secp256k1Blake160.payFee(
    txSkeleton,
    sender,
    BigInt(txFee)
  );
  txSkeleton = secp256k1Blake160.prepareSigningEntries(txSkeleton);
  return txSkeleton;
};

const fetchTransactionStatus = async (txHash) => {
  const tx = await rpc.get_transaction(txHash);
  return tx.tx_status.status;
};

const getCkbBalance = async (lockScript: Script) => {
  let balance = BigInt(0);
  const cells = await indexerService.collectCells({
    lock: lockScript,
  });

  for (const cell of cells) {
    // @ts-ignore
    const amount = BigInt(cell.cell_output.capacity);
    balance += amount;
  }

  return balance;
};

routes.post("/build-transfer", async (req: any, res) => {
  try {
    const txSkeleton = await buildTransferCkbTx(req.body);
    return res
      .status(200)
      .json(JSON.stringify({ params: req.body, txSkeleton }));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

routes.post("/get-balance", async (req: any, res) => {
  const { lockScript } = req.body;
  console.log("/get-balance", req.body);

  try {
    if (!lockScript) {
      throw new Error("Sudt data not supplied");
    }
    const balance = await getCkbBalance(lockScript);
    return res
      .status(200)
      .json(JSON.stringify({ balance: balance.toString() }));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

routes.get("/latest-block", async (req: any, res) => {
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

    console.log(txStatuses);

    return res.status(200).json(JSON.stringify({ txStatuses }));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

routes.post("/transfer", async (req: any, res) => {
  const { params, signatures } = req.body;
  const txSkeleton = await buildTransferCkbTx(params);

  console.log("/transfer", params, signatures);
  try {
    const tx = sealTransaction(txSkeleton, signatures);
    const txHash = await rpc.send_transaction(tx);
    return res.status(200).json(JSON.stringify({ txHash }));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

export default routes;
