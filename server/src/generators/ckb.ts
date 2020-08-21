import { indexer, rpc } from "../index";
import { Script } from "@ckb-lumos/base";
import { common, secp256k1Blake160 } from "@ckb-lumos/common-scripts";
import { TransactionSkeleton } from "@ckb-lumos/helpers";
import { Cell } from "ckb-js-toolkit";

interface CkbTransferParams {
  sender: string;
  recipient: string;
  amount: string;
  txFee: string;
}

export const getCkbBalance = async (lockScript: Script) => {
  let balance = BigInt(0);

  const collector = indexer.collector({ lock: lockScript, type: null });

  const cells: Cell[] = [];
  for await (const cell of collector.collect()) {
    cells.push(cell);
  }

  return cells
    .map((cell) =>
      BigInt(
        // @ts-ignore
        cell.cell_output.capacity
      )
    )
    .reduce((balance, capacity) => (balance = balance += capacity));
};

export const buildTransferCkbTx = async (params: CkbTransferParams) => {
  const { sender, recipient, amount, txFee } = params;

  let txSkeleton = TransactionSkeleton({
    // @ts-ignore
    cellProvider: indexer,
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
