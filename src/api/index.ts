import { Api } from './Api';

// адреса методов уже начинаются с /api, vite проксирует их на бэкенд
export const api = new Api();
