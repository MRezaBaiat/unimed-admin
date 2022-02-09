import Gateway, { ResponseType } from './Gateway';
import Axios from 'axios';
import {
  Notification,
  QueryResponse,
  Reservation,
  ReservationRequest,
  ReservationState,
  User
} from 'api';

export default class ReservationsApi {
  public static setState (reservationId: string, state: ReservationState) {
    return Axios.post('/admin/reservations/state', {
      state,
      id: reservationId
    });
  }

    public static getInfo = (doctorId: string, from: number, to: number): ResponseType<User['details']['reservationInfo'] & {reserved: Reservation[]}> => {
      return Axios.get(`/admin/reservations/info?doctorId=${doctorId}&from=${from}&to=${to}`);
    };

    public static request = (doctorId: string, request: Partial<ReservationRequest>) => {
      return Axios.post(`/admin/reservations/request?doctorId=${doctorId}`, request);
    };

    public static cancel = (reservationId: string, reason: string) => {
      return Axios.put('/admin/reservations/cancel', { reservationId, reason });
    };

    public static end = (reservationId: string) => {
      return Axios.delete(`/admin/reservations/end?reservationId=${reservationId}`);
    };

    public static query (skip: number, limit: number, fromDate: number, toDate: number, search: string): ResponseType<QueryResponse<Reservation>> {
      return Gateway.get(`/admin/reservations/query?skip=${skip}&limit=${limit}&fromDate=${fromDate}&toDate=${toDate}&search=${search}`);
    }
}
