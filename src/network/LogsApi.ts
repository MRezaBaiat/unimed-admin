import Gateway, { ResponseType } from './Gateway';
import { QueryResponse, AdminLog, DebugType } from 'api';
import io from 'socket.io-client';
import AuthService from '../services/AuthService';

// @ts-ignore
const config: SocketIOClient.ConnectOpts = {
  path: '/live/admin',
  transports: ['websocket'],
  reconnection: true,
  reconnectionDelay: 5000,
  forceNew: false,
  autoConnect: false,
  timeout: 5000,
  secure: true,
  query: {
    videoCallVersion: 3
  },
  extraHeaders: {
    videoCallVersion: 3
  }
};

const socket = io('https://www.azdanaz.az', config);
socket.on('unauthorized', console.error)
  .on('connect_error', console.error)
  .on('connect_timeout', console.error)
  .on('error', console.error)
  .on('reconnect', () => console.log('reconnected'))
  .on('disconnect', () => console.log('disconnected'));

window.addEventListener('beforeunload', () => {
  socket.disconnect();
});
window.addEventListener('unload', () => {
  socket.disconnect();
});

const getSocket = async () => {
  // @ts-ignore
  config.query.authorization = AuthService.getAuthorization();
  // @ts-ignore
  config.extraHeaders.authorization = AuthService.getAuthorization();
  if (socket.connected) {
    console.log('socket', 'already connected');
    return socket;
  } else {
    console.log('socket', 'in else');
    return new Promise((resolve, reject) => {
      const listener = () => {
        console.log('socket', 'authenticated');
        resolve(socket);
      };
      socket.once('authenticated', listener);
      socket.once('disconnect', () => {
        socket.removeListener('authenticated', listener);
        reject(new Error('socket disconnected'));
      });
      socket.on('connect', () => {
        console.log('socket', 'connected');
      });
      console.log('socket', 'connecting');
      socket.connect();
    });
  }
};

export default class LogsApi {
  public static getAdminLogs (skip:number, limit:number, search?: string): ResponseType<QueryResponse<AdminLog>> {
    return Gateway.get(`/api/admin/adminlogs/query?skip=${skip}&limit=${limit}&search=${search}`);
  }

  public static getClientLogs = async (userId: string, types: DebugType[]): Promise<{ stop: ()=>void, setCB: (cb: (event)=>void) =>void, getCB:()=>any }> => {
    console.log('socket', 'starting');
    await getSocket();
    console.log('socket', 'got socket');
    return new Promise((resolve, reject) => {
      let cb;
      const listener = (data) => {
        /* if (data.userId !== userId) {
          console.error(`irrelative debug event received from userid ${data.userId}`);
          return;
        } */
        cb && cb(data);
      };
      console.log('socket', 'requesting logs from ' + userId);
      socket.emit('subscribe-debugger', { userId, types });
      socket.on('client-debug', listener);
      resolve({
        stop: () => {
          socket.emit('unsubscribe-debugger', { userId });
          socket.removeListener('client-debug', listener);
        },
        setCB: (callback) => {
          cb = callback;
        },
        getCB: () => cb
      });
    });
  }
}
