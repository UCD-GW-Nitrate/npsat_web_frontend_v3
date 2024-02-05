import React from 'react';
import { useSelector } from 'react-redux';

import { CoreButton } from '@/components/core/CoreButton/CoreButton';
import { useRunModelMutation } from '@/store';
import { selectCurrentModel } from '@/store/slices/modelSlice';

const Step5 = () => {
  const [runModel] = useRunModelMutation();
  const model = useSelector(selectCurrentModel);

  const modelRun = () => {
    const results = runModel(model);
    console.log('run model:', model);
    console.log('run model results:', results);
  };

  return (
    <div>
      <CoreButton onClick={modelRun} label="Run Model" />
    </div>
  );
};

export default Step5;
