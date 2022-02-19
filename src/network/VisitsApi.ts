import Gateway, { ResponseType } from './Gateway';
import { DoctorStatus, PatientStatus, QueryResponse, User, Visit } from 'api';

export default class VisitsApi {
  public static getAllVisits (userId: string | undefined, skip:number, limit:number, { search, from, to, moneyReturned, visitStatus, discount }): ResponseType<QueryResponse<Visit> & {uniquePatients: number, uniqueDoctors: number}> {
    return Gateway.get(`/api/admin/visits/query?id=${userId}&skip=${skip}&limit=${limit}&search=${search}&from=${from || ''}&to=${to || ''}&moneyReturned=${moneyReturned || ''}&visitStatus=${visitStatus || ''}&discount=${discount || ''}`);
  }

  public static getVisit (visitId: string): ResponseType<Visit> {
    return Gateway.get(`/api/admin/visits?id=${visitId}`);
  }

  public static endVisit = (id: string, returnMoney: boolean) => {
    return Gateway.patch('/api/admin/visits/end', { id, returnMoney });
  };

  public static returnVisitPayment = (id: string) => {
    return Gateway.patch('/api/admin/visits/return_payment', { id });
  }

  /* public static getActiveVisits(): ResponseType<any>{

    }

    public static changeVisitStatus(): ResponseType<any>{

    } */
}
