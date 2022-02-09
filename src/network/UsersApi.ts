import Gateway, { ResponseType } from './Gateway';
import { DoctorStatus, PatientStatus, QueryResponse, User, UserType } from 'api';

export default class UsersApi {
  public static uploadProfileImage (userId: string, file:any) {
    const form = new FormData();
    form.append('file', file);
    return Gateway.post(`/admin/users/profileimage?userid=${userId}`, form);
  }

  public static createUser (user: User): ResponseType<User> {
    return Gateway.post('/admin/users', user);
  }

  public static updateUser (user: User): ResponseType<User> {
    return Gateway.patch('/admin/users', user);
  }

  public static getPatients (skip:number, limit:number): ResponseType<{user: User, status: PatientStatus}[]> {
    return Gateway.get(`/admin/users/query?skip=${skip}&limit=${limit}&type=${UserType.PATIENT}`);
  }

  public static getDoctors (skip:number, limit:number): ResponseType<{user: User, status: DoctorStatus}[]> {
    return Gateway.get(`/admin/users/query?skip=${skip}&limit=${limit}&type=${UserType.DOCTOR}`);
  }

  public static getAllUsers (skip:number, limit:number, search?: string, type?:UserType): ResponseType<QueryResponse<{user: User, status: PatientStatus | DoctorStatus, isOnline: boolean}>> {
    return Gateway.get(`/admin/users/query?skip=${skip}&limit=${limit}&search=${search}${type ? `&type=${type}` : ''}`);
  }

  public static getUser (userId: string): ResponseType<User> {
    return Gateway.get(`/admin/users?id=${userId}`);
  }

  public static deleteUser (userId: string): ResponseType<void> {
    return Gateway.delete(`/admin/users?id=${userId}`);
  }

  public static setReadyStatus (userId: string, active: boolean) : ResponseType<void> {
    return Gateway.patch(`/admin/live/ready_status?id=${userId}/active=${active}`);
  }

  public static createJoiningDatesReport (): ResponseType<{[key: string]: number}> {
    return Gateway.get('/admin/users/joining_dates_report');
  }

  /* public static getStatuses(userIds: string[]): ResponseType<void>{

    }

    public static updateStatus(userId:string,status: Status): ResponseType<void>{

    } */
}
