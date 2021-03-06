import Gateway, { ResponseType } from './Gateway';
import { Notification, QueryResponse } from 'api';

export default class NotificationsApi {
  public static postNotification (notification: Notification) {
    return Gateway.post('/api/admin/notifications', notification);
  }

  public static findNotification (id: string): ResponseType<Notification> {
    return Gateway.get(`/api/admin/notifications?id=${id}`);
  }

  public static queryNotifications (skip: number, limit: number, search: string): ResponseType<QueryResponse<Notification>> {
    return Gateway.get(`/api/admin/notifications/query?skip=${skip}&limit=${limit}$search=${search}`);
  }
}
