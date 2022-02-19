import Gateway, { ResponseType } from './Gateway';
import { Conference } from 'api/dist';
import { QueryResponse } from 'api/index';

export default class ConferenceApi {
  public static query (skip: number, limit: number, from: number, to: number, search: string, userId?: string): ResponseType<QueryResponse<Conference>> {
    return Gateway.get(`/api/admin/calls/query?skip=${skip}&limit=${limit}&search=${search || ''}&from=${from}&to=${to}&userId=${userId || ''}`);
  }

  public static getConference (conferenceId: string): ResponseType<Conference> {
    return Gateway.get(`/api/admin/calls/conference?conferenceId=${conferenceId}`);
  }
}
