import Gateway, { ResponseType } from './Gateway';
import { DiscountCoupon, QueryResponse } from 'api';

export default class HealthCentersApi {
  public static getAllDiscounts (skip: number, limit: number, search: string): ResponseType<QueryResponse<DiscountCoupon>> {
    return Gateway.get(`/admin/discounts/query?skip=${skip}&limit=${limit}&search=${search}`);
  }

  public static createDiscount (center: DiscountCoupon): ResponseType<DiscountCoupon> {
    return Gateway.post('/admin/discounts', center);
  }

  public static updateDiscount (center: DiscountCoupon): ResponseType<DiscountCoupon> {
    return Gateway.patch('/admin/discounts', center);
  }

  public static deleteDiscount (id: string): ResponseType<DiscountCoupon> {
    return Gateway.delete(`/admin/discounts?id=${id}`);
  }

  public static getDiscount (id: string): ResponseType<DiscountCoupon> {
    return Gateway.get(`/admin/discounts?id=${id}`);
  }
}
