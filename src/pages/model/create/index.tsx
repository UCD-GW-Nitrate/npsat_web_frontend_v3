import { useTheme } from '@mui/material';
import * as React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import { CoreContainer } from '@/components/core/CoreContainer/CoreContainer';
import { CoreStepper } from '@/components/core/CoreStepper/CoreStepper';
import Layout from '@/components/Layout/Layout';

import Step1 from '../steps/Step1';

const steps = [
  'Select Settings',
  'Select Regions',
  'Select Crops',
  'Enter Scenario Meta',
  'Results',
];

const CreateModelPage = () => {
  const theme = useTheme();

  return (
    <HelmetProvider>
      <Helmet>
        <title>Create Scenario - NPSAT</title>
        <meta name="description" content="Create Scenario - NPSAT" />
      </Helmet>
      <Layout>
        <CoreContainer
          sx={{
            backgroundColor: theme.palette.secondary.main,
            py: 5,
          }}
        >
          <CoreStepper steps={steps} />
          <Step1 />
        </CoreContainer>
      </Layout>
    </HelmetProvider>
  );
};

export default CreateModelPage;
