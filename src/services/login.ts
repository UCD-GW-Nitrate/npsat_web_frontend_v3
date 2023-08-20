import axios from 'axios';

import { BASE_URL } from '.';

export async function userLogin(username: string, password: string) {
  return axios.post(`${BASE_URL}/api-token-auth/`, {
    username,
    password,
  });
}
