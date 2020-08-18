/*
    Keypering Types
    Credit: https://github.com/Keith-CY/keypering/blob/develop/packages/specs/src/api.ts
    Will be replaced by NPM import once available
*/

export declare namespace API {
    interface JsonRpcRequest<RequestParams> {
      id: string
      jsonrpc: string
      method: string
      params: RequestParams
    }
    enum ErrorCode {
      Rejected = 1001,
      TokenInvalid,
    }
  
    interface JsonRpcResponseError<C = ErrorCode> {
      code: C
      message: string
    }
  
    interface JsonRpcResponse<ResponseResult, ResponseError> {
      id: string
      jsonrpc: string
      result?: ResponseResult
      error?: ResponseError
    }
  
    // auth
    interface AuthParams {
      url: string
      description: string
    }
  
    interface AuthResult {
      token: string
    }
  
    type AuthError = JsonRpcResponseError<typeof ErrorCode.Rejected>
    type AuthRequest = JsonRpcRequest<AuthParams>
    type AuthResponse = JsonRpcResponse<AuthResult, AuthError>
  
    type FnAuth = (request: AuthRequest) => Promise<AuthResponse>
  
    // query_addresses
    interface QueryAddressesParams {
      token: string
    }
  
    type Hash256 = string
    type ScriptHashType = 'data' | 'type'
    type Bytes = string
    type Uint64 = string
  
    interface Script {
      codeHash: Hash256
      hashType: ScriptHashType
      args: Bytes
    }
  
    type DepType = 'code' | 'depGroup'
  
    interface OutPoint {
      txHash: Hash256
      index: string
    }
  
    interface CellDep {
      outPoint: OutPoint | null
      depType: DepType
    }
  
    interface LockScriptMeta {
      name: string
      cellDeps: CellDep[]
      headerDeps?: Hash256[]
    }
  
    interface AddressInfo {
      address: string
      lockHash: string
      publicKey: string
      lockScriptMeta: LockScriptMeta
      lockScript: Script
    }
  
    interface QueryAddressesResult {
      addresses: AddressInfo[]
    }
  
    type QueryAddressesError = JsonRpcResponseError
    type QueryAddressesRequest = JsonRpcRequest<QueryAddressesParams>
  
    type QueryAddressesResponse = JsonRpcResponse<QueryAddressesResult, QueryAddressesError>
    type FnQueryAddresses = (request: QueryAddressesRequest) => Promise<QueryAddressesResponse>
  
    // query_live_cells
  
    interface QueryLiveCellsParams {
      token: string
      lockHash: string
      withData?: boolean
    }
  
    interface CellOutput {
      capacity: string
      lock: Script
      type: Script | null
      outputDataLength: Uint64
    }
  
    interface CellCreatedBy {
      blockNumber: Uint64
      index: Uint64
      txHash: Hash256
    }
  
    interface CellData {
      content: string
      hash: Hash256
    }
  
    interface LiveCell {
      cellOutput: CellOutput
      cellbase: boolean
      createdBy: CellCreatedBy
      outputDataLen: Uint64
      data?: CellData
    }
  
    interface QueryLiveCellsResult {
      liveCells: LiveCell[]
    }
  
    type QueryLiveCellsError = JsonRpcResponseError
    type QueryLiveCellsRequest = JsonRpcRequest<QueryLiveCellsParams>
    type QueryLiveCellsResponse = JsonRpcResponse<QueryLiveCellsResult, QueryLiveCellsError>
    type FnQueryLiveCells = (request: QueryLiveCellsRequest) => Promise<QueryLiveCellsResponse>
  
    // sign_send
    interface SignConfig {
      index: number
      length: number
    }
  
    type Transaction = any
    type SignedTransaction = any
  
    interface SignSendParams {
      token: string
      description: string
      tx: Transaction
      lockHash: Hash256
      config?: SignConfig
    }
  
    interface SignSendResult {
      tx: SignedTransaction
      txHash: Hash256
    }
  
    type SignSendError = JsonRpcResponseError
    type SignSendRequest = JsonRpcRequest<SignSendParams>
    type SignSendResponse = JsonRpcResponse<SignSendRequest, SignSendError>
    type FnSignSend = (request: SignSendRequest) => Promise<SignSendResponse>
  }