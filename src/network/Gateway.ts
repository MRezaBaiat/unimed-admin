import axios, { AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
export type ResponseType<T> = AxiosPromise<T>

export default class Gateway {
  static put<T> (url: string, body: {}, headers?, config?: AxiosRequestConfig): ResponseType<T> {
    return this.execute(url, 'PUT', headers, { ...config, data: body });
  }

  static get<T> (url: string, headers?, config?: AxiosRequestConfig): ResponseType<T> {
    return this.execute(url, 'GET', headers, config);
  }

  static post<T> (url: string, body: any | string, headers?, config?: AxiosRequestConfig): ResponseType<T> {
    return this.execute(url, 'POST', headers, { ...config, data: body });
  }

  static patch<T> (url: string, body?: {} | string, headers?, config?: AxiosRequestConfig): ResponseType<T> {
    return this.execute(url, 'PATCH', headers, { ...config, data: body });
  }

  static delete<T> (url: string, body?: {} | string, headers?, config?: AxiosRequestConfig): ResponseType<T> {
    return this.execute(url, 'DELETE', headers, { ...config, data: body });
  }

  // @ts-ignore
  static execute = <T>(url: string, method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH' | 'OPTIONS' = 'GET', headers = {}, config?: AxiosRequestConfig): ResponseType<T> => axios.request(url, {
    ...config,
    headers,
    method
  }).then(Gateway.limitStatus)
    .catch(Gateway.handleError);

  static convertResponse (error, res: AxiosResponse) {
    if (res) {
      res = res.data;
    }
    return { data: res, error };
  }

  static limitStatus = (payload) => {
    // if (payload.status !== 200) return Promise.reject(new Error('status received was ' + payload.status));
    return Promise.resolve(payload);
  };

  static handleError = (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // TODO
        // AuthService.logOut();
      }
    }/* else if (error.request) {

    } else {

    } */
    if (error.response) {
      if (error.response.data && error.response.data.error) {
        console.log(error.response.data.error);
        alert(error.response.data.error);
      }/* else if (error.message) {
        alert(error.message);
      } */
    }
    return Promise.reject(new Error(error.message));
  }
}

export function fileFormData (filePath: string, type = 'image/jpeg') {
  const formData = new FormData();
  // @ts-ignore
  formData.append('file', {
    uri: filePath,
    type: type,
    name: 'photo.jpg'
  });
  return formData;
}
