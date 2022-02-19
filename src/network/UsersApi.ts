import Gateway, { ResponseType } from './Gateway';
import { DoctorStatus, PatientStatus, QueryResponse, User, UserType } from 'api';

export default class UsersApi {
  public static uploadProfileImage (userId: string, file:any) {
    const form = new FormData();
    form.append('file', file);
    return Gateway.post(`/api/admin/users/profileimage?userid=${userId}`, form);
  }

  public static createUser (user: User): ResponseType<User> {
    return Gateway.post('/api/admin/users', user);
  }

  public static updateUser (user: User): ResponseType<User> {
    return Gateway.patch('/api/admin/users', user);
  }

  public static getPatients (skip:number, limit:number): ResponseType<{user: User, status: PatientStatus}[]> {
    return Gateway.get(`/api/admin/users/query?skip=${skip}&limit=${limit}&type=${UserType.PATIENT}`);
  }

  public static getDoctors (skip:number, limit:number): ResponseType<{user: User, status: DoctorStatus}[]> {
    return Gateway.get(`/api/admin/users/query?skip=${skip}&limit=${limit}&type=${UserType.DOCTOR}`);
  }

  public static getAllUsers (skip:number, limit:number, search?: string, type?:UserType): ResponseType<QueryResponse<{user: User, status: PatientStatus | DoctorStatus, isOnline: boolean}>> {
    return Gateway.get(`/api/admin/users/query?skip=${skip}&limit=${limit}&search=${search}${type ? `&type=${type}` : ''}`);
  }

  public static getUser (userId: string): ResponseType<User> {
    return Gateway.get(`/api/admin/users?id=${userId}`);
  }

  public static deleteUser (userId: string): ResponseType<void> {
    return Gateway.delete(`/api/admin/users?id=${userId}`);
  }

  public static setReadyStatus (userId: string, active: boolean) : ResponseType<void> {
    return Gateway.patch(`/api/admin/live/ready_status?id=${userId}/active=${active}`);
  }

  public static createJoiningDatesReport (): ResponseType<{[key: string]: number}> {
    return Gateway.get('/api/admin/users/joining_dates_report');
  }
}
