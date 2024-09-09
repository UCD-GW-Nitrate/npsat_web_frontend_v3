'use client';

import type { PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { setCredentials } from '@/store/slices/authSlice';
import type { AuthState } from '@/types/user/User';

import AppLayout from '../AppLayout/AppLayout';

const CachedAuthState = ({ children }: PropsWithChildren) => {
  const dispatch = useDispatch();
  const [fetchedOnce, setFetechedOnce] = useState(false);

  useEffect(() => {
    const cachedAuthState: AuthState = JSON.parse(
      localStorage.getItem('npsat_user_info') ?? '{}',
    );

    console.log('cachedAuthState', cachedAuthState);

    dispatch(setCredentials(cachedAuthState));
    setFetechedOnce(true);
  }, []);

  if (!fetchedOnce) {
    return <AppLayout />;
  }

  return <>{children}</>;
};

export default CachedAuthState;
