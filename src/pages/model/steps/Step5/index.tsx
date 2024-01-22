import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { useRunModelMutation } from '@/store';
import { selectCurrentModel } from '@/store/slices/modelSlice';

const Step5 = () => {
  const [runModel] = useRunModelMutation();
  const model = useSelector(selectCurrentModel);

  useEffect(() => {
    const results = runModel(model);
    console.log('run model:', model);
    console.log('run model results:', results);
  }, []);

  return <div />;
};

export default Step5;
