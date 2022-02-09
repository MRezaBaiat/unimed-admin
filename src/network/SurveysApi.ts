import Gateway, { ResponseType } from './Gateway';
import { QueryResponse, Visit } from 'api';

export default class SurveysApi {
  public static querySurveys (skip:number, limit:number, { search, from, to }): ResponseType<QueryResponse<Visit>> {
    return Gateway.get(`/admin/surveys/query?skip=${skip}&limit=${limit}&search=${search}&from=${from || ''}&to=${to || ''}`);
  }
}
