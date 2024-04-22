import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import type { AuthState } from '@/store/apis/authApi';
import { setCredentials } from '@/store/slices/authSlice';

const CachedAuthState = ({ children }: PropsWithChildren) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const cachedAuthState: AuthState = JSON.parse(
      localStorage.getItem('npsat_user_info') ?? '{}',
    );

    console.log('cachedAuthState', cachedAuthState);

    dispatch(setCredentials(cachedAuthState));
  }, []);

  return <>{children}</>;
};

export default CachedAuthState;
