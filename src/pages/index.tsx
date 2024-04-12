import React from 'react';
import { useSelector } from 'react-redux';

import SecurityLayout from '@/components/custom/SecurityLayout/SecutiryLayout';
import { selectCurrentUser } from '@/store/slices/authSlice';

import Homepage from './hompage';

const Index = () => {
  const user = useSelector(selectCurrentUser);

  if (user === null) {
    return <SecurityLayout />;
  }

  return <Homepage />;
};

export default Index;
