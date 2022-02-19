import Gateway, { ResponseType } from './Gateway';
import { ServerConfig } from 'api';

export default class ServerConfigsApi {
  public static getServerConfigs ():ResponseType<ServerConfig> {
    return Gateway.get('/api/admin/serverconfigs');
  }

  public static patchServerConfigs (config: Partial<ServerConfig>):ResponseType<ServerConfig> {
    return Gateway.patch('/api/admin/serverconfigs', config);
  }
}
