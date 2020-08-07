import axios from "axios";

export enum ResponseCode {
  SUCCESS,
  ERROR,
}

export interface Response {
  code: ResponseCode;
  payload?: any;
  error?: string;
}

/* 
    Wrappers around REST calls to dApp server
*/
export class Api {
  static async get(uri, endpoint): Promise<Response> {
    try {
      const response = await axios.get(`${uri}${endpoint}`);
      const payload = JSON.parse(response.data);
      return {
        code: ResponseCode.SUCCESS,
        payload,
      };
    } catch (error) {
      throw new Error(JSON.parse(error.request.response).error);
    }
  }

  static async post(uri, endpoint, params): Promise<Response> {
    try {
      const response = await axios.post(`${uri}${endpoint}`, params);
      const payload = JSON.parse(response.data);
      return {
        code: ResponseCode.SUCCESS,
        payload,
      };
    } catch (error) {
      throw new Error(JSON.parse(error.request.response).error);
    }
  }
}
