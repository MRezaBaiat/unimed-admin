import { createHashHistory } from 'history';

export const history = createHashHistory();

export default class NavigationHelper {
  public static navigateTo (path: string, params?:{}) {
    let search = '';
    if (params) {
      search = new URLSearchParams(params).toString();
      /* search = '?';
      Object.keys(params).forEach((k) => {
        search += `${k}=${params[k]}&`;
      });
      if (search.endsWith('&')) {
        search = search.substr(0, search.length - 1);
      } */
    }
    history.push({ pathname: path, search });
  }

  public static getParam (props: any, key: string): string {
    // @ts-ignore
    return new URLSearchParams(props.location.search).get(key);
  }

  public static goBack () {
    history.goBack();
  }
}
