import Gateway, { ResponseType } from './Gateway';
import { HealthCenter, QueryResponse, User } from 'api';

export default class HealthCentersApi {
  public static uploadLogoImage (id: string, file:any): ResponseType<string> {
    const form = new FormData();
    form.append('file', file);
    return Gateway.patch(`/api/admin/healthcenters/logoimage?id=${id}`, form);
  }

  public static uploadWallpaper (id: string, file:any): ResponseType<string> {
    const form = new FormData();
    form.append('file', file);
    return Gateway.patch(`/api/admin/healthcenters/wallpaperimage?id=${id}`, form);
  }

  public static getAllHealthCenters (skip: number, limit: number, search: string): ResponseType<QueryResponse<HealthCenter>> {
    return Gateway.get(`/api/admin/healthcenters/query?skip=${skip}&limit=${limit}&search=${search}`);
  }

  public static createHealthCenter (center: HealthCenter): ResponseType<HealthCenter> {
    return Gateway.post('/api/admin/healthcenters', center);
  }

  public static updateHealthCenter (center: HealthCenter): ResponseType<HealthCenter> {
    return Gateway.patch('/api/admin/healthcenters', center);
  }

  public static deleteHealthCenter (id: string): ResponseType<HealthCenter> {
    return Gateway.delete(`/api/admin/healthcenters?id=${id}`);
  }

  public static getHealthCenter (id: string): ResponseType<HealthCenter> {
    return Gateway.get(`/api/admin/healthcenters?id=${id}`);
  }

  public static getDoctorsIn (healthCenterId: string):ResponseType<User[]> {
    return Gateway.get(`/api/admin/healthcenters/in?id=${healthCenterId}`);
  }
}
