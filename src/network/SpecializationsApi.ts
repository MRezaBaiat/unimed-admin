import Gateway, { ResponseType } from './Gateway';
import { QueryResponse, Specialization } from 'api';

export default class SpecializationsApi {
  public static getSpecializations (skip: number, limit: number, search: string): ResponseType<QueryResponse<Specialization>> {
    return Gateway.get(`/api/admin/specializations/query?skip=${skip}&limit=${limit}&search=${search}`);
  }

  public static createSpecialization (specialization: Specialization): ResponseType<Specialization> {
    return Gateway.post('/api/admin/specializations', specialization);
  }

  public static updateSpecialization (specialization: Specialization): ResponseType<Specialization> {
    return Gateway.patch('/api/admin/specializations', specialization);
  }

  public static deleteSpecialization (id: string): ResponseType<Specialization> {
    return Gateway.delete(`/api/admin/specializations?id=${id}`);
  }

  public static getSpecialization (id: string): ResponseType<Specialization> {
    return Gateway.get(`/api/admin/specializations?id=${id}`);
  }
}
