import axios from 'axios';

interface MasonryMaterialUserResponse {
  id: number;
  fullName: string;
}

// вход и выход — обычные запросы axios, без кодогенерации; кука сессии ставится и удаляется бэкендом
export const loginMasonryMaterialUser = (fullName: string, password: string) =>
  axios.post<MasonryMaterialUserResponse>('/api/users/login', { fullName, password });

export const logoutMasonryMaterialUser = () => axios.post('/api/users/logout');
