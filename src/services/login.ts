import axios from 'axios';

import { BASE_URL } from '.';

export async function userLogin(username: string, password: string) {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  return axios.post(`${BASE_URL}/api-token-auth/`, {
    params,
  });
}
