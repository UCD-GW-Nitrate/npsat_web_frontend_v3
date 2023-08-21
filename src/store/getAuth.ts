import type { RootState } from '.';

const getAuth = (headers: Headers, getState: () => unknown): Headers => {
  const { token } = (getState() as RootState).auth;
  if (token) {
    headers.set('authorization', `Token ${token}`);
  }
  return headers;
};

export default getAuth;
