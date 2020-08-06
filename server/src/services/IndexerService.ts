import {
  Indexer,
  TransactionCollector,
} from "@ckb-lumos/indexer";
import { Cell } from "ckb-js-toolkit";

export class IndexerService {
  indexer: Indexer;
  constructor(url, dataDir) {
    this.indexer = new Indexer(url, dataDir);
  }

  async collectCells(params): Promise<Cell[]> {
    const collector = this.indexer.collector(params);

    const cells: Cell[] = [];
    for await (const cell of collector.collect()) {
      cells.push(cell);
    }

    return cells;
  }
}