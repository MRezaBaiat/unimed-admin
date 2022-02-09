import Gateway, { ResponseType } from './Gateway';
import { Admin, QueryResponse } from 'api';

export default class AdminsApi {
    public static createAdmin = (admin: Admin): ResponseType<Admin> => {
      return Gateway.post('/admin/admins', admin);
    }

    public static findAdmins = (skip: number, limit:number, search: string): ResponseType<QueryResponse<Admin>> => {
      return Gateway.get(`/admin/admins/query?skip=${skip}&limit=${limit}&search=${search}`);
    }

    public static findAdmin = (adminId: string): ResponseType<Admin> => {
      return Gateway.get(`/admin/admins?id=${adminId}`);
    };

    public static updateAdmin = (admin: Admin): ResponseType<Admin> => {
      return Gateway.patch('/admin/admins', admin);
    };
}
