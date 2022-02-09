import Gateway, { ResponseType } from './Gateway';
import { MedicalService, ServerConfig } from 'api';

export default class ServerConfigsApi {
  public static getServerConfigs ():ResponseType<ServerConfig> {
    return Gateway.get('/admin/serverconfigs');
  }

  public static patchServerConfigs (config: Partial<ServerConfig>):ResponseType<ServerConfig> {
    return Gateway.patch('/admin/serverconfigs', config);
  }
}
