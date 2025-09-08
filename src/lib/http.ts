import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '@/constants';

const JWT_NAME = STORAGE_KEYS.USER_TOKEN;
const BASE_URL = process.env.NODE_ENV === 'production' ? '/' : API_BASE_URL;

// Глобальные экземпляры для обновления
let globalHttpInstances: Http[] = [];

function create(http: Http) {
  const h: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json;utf-8',
  };

  const jwt = typeof window !== 'undefined' ? localStorage.getItem(JWT_NAME) : null;

  if (jwt) {
    h.Authorization = `Bearer ${jwt}`;
  }

  if (http.interceptorId > -1 && http.ax) {
    http.ax.interceptors.response.eject(http.interceptorId);
  }

  http.ax = axios.create({
    baseURL: BASE_URL,
    headers: h,
    timeout: 180000000000000,
  });

  if (http.interceptor && http.ax) {
    const interceptor = http.interceptor;
    http.interceptorId = http.ax.interceptors.response.use(
      (r: AxiosResponse) => r,
      (error: any) => {
        if (error.response?.status === 401) {
          http.logout();
          interceptor(error);
        }
        return Promise.reject(error);
      }
    );
  }
}

function errHandler(http: Http, err: (error: any) => void, overrideGlobalHandler?: (error: any) => boolean) {
  return (e: any) => {
    const er = {
      cannotConnect: e.code === 'ERR_NETWORK' || e.code === 'ETIMEDOUT' || undefined,
      status: e.response?.status,
      d: e.response?.data || undefined,
      e,
    };

    if (http.globalErrorHandler && (!overrideGlobalHandler || !overrideGlobalHandler(er))) {
      http.globalErrorHandler(er);
    }

    err(er);
  };
}

class RequestMethods {
  get cli(): AxiosInstance | null {
    return null;
  }

  get<T = any>(url: string, overrideGlobalErrorHandler?: (error: any) => boolean): Promise<T> {
    return new Promise((res, err) =>
      this.cli!.get(url).then(
        (r: AxiosResponse<T>) => res(r.data),
        errHandler(this as any, err, overrideGlobalErrorHandler)
      )
    );
  }

  getBin(url: string, overrideGlobalErrorHandler?: (error: any) => boolean): Promise<Blob> {
    return new Promise((res, err) => {
      this.cli!.get(url, { responseType: 'arraybuffer' }).then(
        (r: AxiosResponse<ArrayBuffer>) => res(new Blob([r.data], { type: r.headers['content-type'] })),
        errHandler(this as any, err, overrideGlobalErrorHandler)
      );
    });
  }

  post<T = any>(
    url: string,
    body?: any,
    overrideGlobalErrorHandler?: (error: any) => boolean
  ): Promise<T> {
    return new Promise((res, err) =>
      this.cli!.post(url, body).then(
        (r: AxiosResponse<T>) => res(r.data),
        errHandler(this as any, err, overrideGlobalErrorHandler)
      )
    );
  }

  put<T = any>(
    url: string,
    body?: any,
    overrideGlobalErrorHandler?: (error: any) => boolean
  ): Promise<T> {
    return new Promise((res, err) =>
      this.cli!.put(url, body).then(
        (r: AxiosResponse<T>) => res(r.data),
        errHandler(this as any, err, overrideGlobalErrorHandler)
      )
    );
  }

  delete<T = any>(
    url: string,
    body?: any,
    overrideGlobalErrorHandler?: (error: any) => boolean
  ): Promise<T> {
    return new Promise((res, err) =>
      this.cli!.delete(url, body).then(
        (r: AxiosResponse<T>) => res(r.data),
        errHandler(this as any, err, overrideGlobalErrorHandler)
      )
    );
  }
}

export class Http extends RequestMethods {
  interceptorId: number;
  interceptor: ((error: any) => void) | null;
  globalErrorHandler: ((error: any) => void) | null;
  loginHandler: (() => void) | null;
  logoutHandler: (() => void) | null;
  ax: AxiosInstance | null;

  constructor() {
    super();

    this.interceptorId = -1;
    this.interceptor = null;
    this.globalErrorHandler = null;
    this.loginHandler = null;
    this.logoutHandler = null;
    this.ax = null;

    create(this);

    // Регистрируем экземпляр в глобальном списке
    globalHttpInstances.push(this);
  }

  get cli(): AxiosInstance | null {
    return this.ax;
  }

  setLoginHandler(handler: () => void) {
    this.loginHandler = handler;
    if (handler && this.loggedIn) {
      handler();
    }
  }

  setLogoutHandler(handler: () => void) {
    this.logoutHandler = handler;
  }

  setGlobalErrorHandler(handler: (error: any) => void) {
    this.globalErrorHandler = handler;
  }

  set403Interceptor(interceptor: (error: any) => void) {
    this.interceptor = interceptor;
    create(this);
  }

  get loggedIn(): boolean {
    return !!localStorage.getItem(JWT_NAME)?.length;
  }

  login(jwt: string) {
    localStorage.setItem(JWT_NAME, jwt);
    create(this);
    if (this.loginHandler) this.loginHandler();
  }

  logout() {
    localStorage.removeItem(JWT_NAME);
    create(this);
    if (this.logoutHandler) this.logoutHandler();
  }

  // Статический метод для обновления всех HTTP клиентов
  static updateAllClients(token: string | null) {
    if (token) {
      localStorage.setItem(JWT_NAME, token);
    } else {
      localStorage.removeItem(JWT_NAME);
    }

    // Обновляем все зарегистрированные экземпляры
    globalHttpInstances.forEach(http => {
      if (token) {
        http.login(token);
      } else {
        http.logout();
      }
    });
  }

  // Статический метод для получения текущего токена
  static getCurrentToken(): string | null {
    return localStorage.getItem(JWT_NAME);
  }

  // Статический метод для проверки авторизации
  static isLoggedIn(): boolean {
    return !!localStorage.getItem(JWT_NAME)?.length;
  }
}

export class PublicHttp extends RequestMethods {
  ax: AxiosInstance;

  constructor() {
    super();

    this.ax = axios.create({
      baseURL: BASE_URL,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;utf-8',
      },
      timeout: 180000000000000,
    });
  }

  get cli(): AxiosInstance {
    return this.ax;
  }
} 