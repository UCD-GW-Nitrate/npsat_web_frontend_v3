import { redirect } from 'next/navigation';
import type { PropsWithChildren } from 'react';

interface SecurityLayoutProps extends PropsWithChildren {
  loading?: boolean;
}

const SecurityLayout = ({ children, loading }: SecurityLayoutProps) => {
  const authenticated = false;

  if (!authenticated) {
    redirect('/user/login');
  }

  if (loading) {
    return <div />;
  }

  return children;
};

export default SecurityLayout;
