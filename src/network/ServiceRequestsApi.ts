import { MedicalService, PatientStatus, QueryResponse, ServiceRequest, User, UserType } from 'api';
import Gateway, { ResponseType } from './Gateway';

export default class ServiceRequestsApi {
  public static getServiceRequests (skip:number, limit:number, search: string): ResponseType<QueryResponse<ServiceRequest>> {
    return Gateway.get(`/admin/servicerequests/query?skip=${skip}&limit=${limit}&search=${search}`);
  }

  public static getServiceRequest (id: string): ResponseType<ServiceRequest> {
    return Gateway.get(`/admin/servicerequests?id=${id}`);
  }

  public static updateServiceRequest (request: Partial<ServiceRequest>): ResponseType<ServiceRequest> {
    return Gateway.patch('/admin/servicerequests', request);
  }

  public static deleteServiceRequest (id: string): ResponseType<ServiceRequest> {
    return Gateway.delete(`/admin/servicerequests?id=${id}`);
  }
}
