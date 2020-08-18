import {
  HexString,
  Script,
  CellDep,
  DepType,
  Cell,
} from "@ckb-lumos/base";

interface KeyperingTransaction extends CKBComponents.RawTransaction {
  witnesses: any[]
}

export const toRawWitness = (witness: HexString): HexString => {
  return '0x' + witness.substring(42);
}

const fromLumosDepType = (depType: DepType): CKBComponents.DepType => {
  switch (depType) {
    case "dep_group":
      return "depGroup";
    case "code":
      return "code";
    default:
      throw new Error("Invalid DepType specified");
  }
};

const fromLumosScript = (script: Script): CKBComponents.Script => {
  return {
    codeHash: script.code_hash,
    hashType: script.hash_type,
    args: script.args,
  };
};

const fromLumosCellDep = (cellDep: CellDep): CKBComponents.CellDep => {
  return {
    outPoint: {
      index: cellDep.out_point.index,
      txHash: cellDep.out_point.tx_hash,
    },
    depType: fromLumosDepType(cellDep.dep_type),
  };
};

const fromLumosKeyperInput = (input: Cell): CKBComponents.CellInput => {
  if (!input.out_point) {
    throw new Error("No outpoint on input");
  }
  return {
    previousOutput: {
      index: input.out_point.index,
      txHash: input.out_point.tx_hash,
    },
    since: "0x0",
  };
};

const fromLumosKeyperOutputs = (
  outputs: Cell[]
): { outputs: CKBComponents.CellOutput[]; outputsData: CKBComponents.Bytes[] } => {
  const result = {
    outputs: [] as CKBComponents.CellOutput[],
    outputsData: [] as CKBComponents.Bytes[],
  };

  outputs.forEach((output) => {
    result.outputs.push({
      capacity: output.cell_output.capacity,
      lock: fromLumosScript(output.cell_output.lock),
      type: output.cell_output.type
        ? fromLumosScript(output.cell_output.type)
        : null,
    });

    result.outputsData.push(output.data);
  });

  return result;
};

export const fromTxSkeleton = (
  txSkeleton: any
): KeyperingTransaction => {
  const { outputs, outputsData } = fromLumosKeyperOutputs(
    txSkeleton.outputs
  );

  return {
    version: "0x0",
    cellDeps: txSkeleton.cellDeps.map((dep) => fromLumosCellDep(dep)),
    inputs: txSkeleton.inputs
      .map((input) => fromLumosKeyperInput(input)),
    outputs,
    outputsData,
    headerDeps: txSkeleton.headerDeps,
    witnesses: []
  };
};
