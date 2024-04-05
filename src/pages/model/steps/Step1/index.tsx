import { Box, Divider } from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import type { FieldValues } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { CoreDateField } from '@/components/core/CoreDateField/CoreDateField';
import { CoreDateRangeField } from '@/components/core/CoreDateRangeField/CoreDateRangeField';
import { CoreForm } from '@/components/core/CoreForm/CoreForm';
import { CoreFormLayout } from '@/components/core/CoreForm/CoreFormLayout';
import { CoreNumberField } from '@/components/core/CoreNumberField/CoreNumberField';
import { CoreSelect } from '@/components/core/CoreSelect/CoreSelect';
import { PageAdvancementButtons } from '@/components/custom/PageAdvancementButtons/PageAdvancementButtons';
import type { Scenario } from '@/hooks/useScenarioGroups';
import { useScenarioGroups } from '@/hooks/useScenarioGroups';
import {
  setModelFlowScenario,
  setModelLoadScenario,
  setModelReductionEndYear,
  setModelReductionStartYear,
  setModelSimEndYear,
  setModelUnsatScenario,
  setModelWaterContent,
  setModelWelltypeScenario,
} from '@/store/slices/modelSlice';

import type { Step } from '../../create';
import Step1Instructions from './Step1Instructions';

const fields = [
  { label: 'Flow scenario:' },
  { label: 'Load scenario:' },
  { label: 'Well Type scenario:' },
  { label: 'Unsaturated zone depth scenario:' },
  { label: 'Unsaturated zone effective water content:' },
  { label: 'Simulation ending year:' },
  { label: 'Transition period:' },
];

interface Step1Props extends Step {}

const Step1 = ({ onPrev, onNext }: Step1Props) => {
  const dispatch = useDispatch();
  const [flowScenarioOptions, setFlowScenarioOptions] = useState<Scenario[]>(
    [],
  );
  const [loadScenarioOptions, setLoadScenarioOptions] = useState<Scenario[]>(
    [],
  );
  const [unsatScenarioOptions, setUnsatScenarioOptions] = useState<Scenario[]>(
    [],
  );
  const [welltypeScenarioOptions, setWelltypeScenarioOptions] = useState<
    Scenario[]
  >([]);
  const {
    flowScenarios: flowScen,
    loadScenarios: loadScen,
    unsatScenarios: unsatScen,
    welltypeScenarios: welltypeScen,
  } = useScenarioGroups();

  useEffect(() => {
    setFlowScenarioOptions(flowScen ?? []);
  }, [flowScen]);
  useEffect(() => {
    setLoadScenarioOptions(loadScen ?? []);
  }, [loadScen]);
  useEffect(() => {
    setUnsatScenarioOptions(unsatScen ?? []);
  }, [unsatScen]);
  useEffect(() => {
    setWelltypeScenarioOptions(welltypeScen ?? []);
  }, [welltypeScen]);

  console.log('flow scen', flowScen);

  const onFormSubmit = (data: FieldValues) => {
    dispatch(setModelFlowScenario({ id: data['flow scenario'] }));
    dispatch(setModelLoadScenario({ id: data['load scenario'] }));
    dispatch(setModelWelltypeScenario({ id: data['well type scenario'] }));
    dispatch(setModelUnsatScenario(data['unsat zone depth scenario']));
    dispatch(setModelWaterContent(data['water content']));
    dispatch(setModelSimEndYear((data['sim end year'] as Date)?.getFullYear()));
    dispatch(
      setModelReductionStartYear(
        (data['transition period start'] as Date)?.getFullYear(),
      ),
    );
    dispatch(
      setModelReductionEndYear(
        (data['transition period end'] as Date)?.getFullYear(),
      ),
    );
    onNext();
  };

  return (
    <Box>
      <CoreForm
        sx={{
          mt: 6,
        }}
        onFormSubmit={(data: FieldValues) => onFormSubmit(data)}
      >
        <CoreFormLayout fields={fields}>
          <CoreSelect
            options={flowScenarioOptions.map((scen) => ({
              label: scen.name,
              value: scen.id,
            }))}
            sx={{ display: 'flex', flexGrow: 1 }}
            name="flow scenario"
            key="flow scenario"
            formField
          />
          <CoreSelect
            options={loadScenarioOptions.map((scen) => ({
              label: scen.name,
              value: scen.id,
            }))}
            sx={{ display: 'flex', flexGrow: 1 }}
            name="load scenario"
            key="load scenario"
            formField
          />
          <CoreSelect
            options={welltypeScenarioOptions.map((scen) => ({
              label: scen.name,
              value: scen.id,
            }))}
            sx={{ display: 'flex', flexGrow: 1 }}
            name="well type scenario"
            key="well type scenario"
            formField
          />
          <CoreSelect
            options={unsatScenarioOptions.map((scen) => ({
              label: scen.name,
              value: scen.id,
            }))}
            sx={{ display: 'flex', flexGrow: 1 }}
            name="unsat zone depth scenario"
            key="unsat zone depth scenario"
            formField
          />
          <CoreNumberField sx={{ width: 100 }} units="%" name="water content" />
          <CoreDateField
            name="sim end year"
            views={['year']}
            defaultDate={dayjs(new Date(2100, 1, 1))}
          />
          <CoreDateRangeField name="transition period" />
          <PageAdvancementButtons onClickPrev={onPrev} />
        </CoreFormLayout>
      </CoreForm>
      <Divider sx={{ mt: 6 }} />
      <Step1Instructions />
    </Box>
  );
};

export default Step1;
