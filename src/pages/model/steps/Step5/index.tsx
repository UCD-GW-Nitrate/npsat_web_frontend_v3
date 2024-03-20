import { Box, CircularProgress } from '@mui/material';
import { Result } from 'antd';
import React, { useEffect } from 'react';

import { CoreButton } from '@/components/core/CoreButton/CoreButton';
import { CoreText } from '@/components/core/CoreText/CoreText';
import { useGetModelStatusQuery } from '@/store';

// import styles from './index.css';

interface Step5Props {
  ids: any;
}

const Step5 = ({ ids }: Step5Props) => {
  const { data } = useGetModelStatusQuery(
    { ids },
    {
      pollingInterval: 1000,
    },
  );

  useEffect(() => {
    console.log('model data is', data);
  }, [data]);

  const extra = (
    <>
      <CoreButton label="View scenario run" variant="contained" />
      <CoreButton label="Compare with BAU" variant="outlined" />
      <CoreButton label="Create another scenario" variant="outlined" />
    </>
  );

  return (
    <Box sx={{ mx: 'auto' }}>
      {!(data && data.results[0] && data.results[0].status === 3) && (
        <Box
          display="flex"
          alignItems="center"
          flexDirection="column"
          sx={{ mt: 5 }}
        >
          <CircularProgress size="4rem" />
          <CoreText sx={{ mt: 2 }}>Creating Scenario...</CoreText>
        </Box>
      )}
      {data && data.results[0] && data.results[0].status === 3 && (
        <Result status="success" title="Scenario created" extra={extra} />
      )}
    </Box>
  );
};

export default Step5;
