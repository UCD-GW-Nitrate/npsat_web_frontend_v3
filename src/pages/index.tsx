import React from 'react';
import { useSelector } from 'react-redux';

import Layout from '@/components/custom/Layout/Layout';
import SecurityLayout from '@/components/custom/SecurityLayout/SecutiryLayout';
import { selectCurrentUser } from '@/store/slices/authSlice';

import Homepage from './hompage';

const Index = () => {
  const user = useSelector(selectCurrentUser);

  if (user === null) {
    return (
      <Layout>
        <SecurityLayout />
      </Layout>
    );
  }

  return (
    <Layout>
      <Homepage />
    </Layout>
  );
};

export default Index;
