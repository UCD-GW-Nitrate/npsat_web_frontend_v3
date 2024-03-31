import { Box, Divider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import type { FieldValues } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import type { CoreFormField } from '@/components/core/CoreForm/CoreForm';
import { CoreForm } from '@/components/core/CoreForm/CoreForm';
import { CoreFormLayout } from '@/components/core/CoreForm/CoreFormLayout';
import type { CoreMultipleSelectOption } from '@/components/core/CoreMultipleSelect/CoreMultipleSelect';
import { CoreMultipleSelect } from '@/components/core/CoreMultipleSelect/CoreMultipleSelect';
import { CoreSlider } from '@/components/core/CoreSlider/CoreSlider';
import { PageAdvancementButtons } from '@/components/custom/PageAdvancementButtons/PageAdvancementButtons';
import { useGetAllCropsByFlowScenarioQuery } from '@/store';
import type { Crop } from '@/store/apis/cropApi';
import type { CropModification } from '@/store/slices/modelSlice';
import { setModelModifications } from '@/store/slices/modelSlice';

import type { Step } from '../../create';
import Step3Instructions from './Step3Instructions';

interface Step3Props extends Step {}

const Step3 = ({ onPrev, onNext }: Step3Props) => {
  const { data: cropData } = useGetAllCropsByFlowScenarioQuery(1);
  const [crops, setCrops] = useState<CoreMultipleSelectOption[]>([]);
  const [selectedCrops, setSelectedCrops] = useState<
    (CoreMultipleSelectOption | undefined)[]
  >([]);

  const dispatch = useDispatch();
  const onFormSubmit = (data: FieldValues) => {
    const modifications: CropModification[] = [];
    selectedCrops.forEach((c) => {
      if (c) {
        modifications.push({
          crop: {
            id: c.value,
          },
          proportion: data[c.label] / 100,
        });
      }
    });

    dispatch(setModelModifications(modifications));
    onNext();
  };

  const [fields, setFields] = useState<CoreFormField[]>([]);
  const handeCropSelect = (
    selected: (CoreMultipleSelectOption | undefined)[],
  ) => {
    setSelectedCrops(selected);
    setFields([
      { label: 'Crop(s):' },
      ...selected.map((selectedVal) => {
        return { label: `${selectedVal?.label} Loading:` ?? '' };
      }),
    ]);
  };

  useEffect(() => {
    const cropsTemp: CoreMultipleSelectOption[] = [];
    (cropData?.results ?? []).forEach((crop: Crop) => {
      cropsTemp.push({
        label: crop.name,
        value: crop.id,
      });
    });
    setCrops(cropsTemp);

    const defaultVal = [cropsTemp[1]];
    setSelectedCrops(defaultVal);
    setFields([
      { label: 'Crop(s):' },
      ...defaultVal.map((selectedVal) => {
        return { label: `${selectedVal?.label} Loading:` ?? '' };
      }),
    ]);
  }, [cropData]);

  return (
    <Box>
      <CoreForm
        sx={{
          mt: 6,
        }}
        onFormSubmit={onFormSubmit}
      >
        <CoreFormLayout fields={fields}>
          <CoreMultipleSelect
            options={crops}
            sx={{ width: 400 }}
            placeholder=""
            group={false}
            fieldValue={selectedCrops}
            setFieldValue={handeCropSelect}
          />
          {selectedCrops.map((crop) => (
            <CoreSlider
              units="%"
              key={crop?.label}
              min={0}
              max={200}
              name={crop?.label ?? ''}
              formField
            />
          ))}
          <PageAdvancementButtons onClickPrev={onPrev} />
        </CoreFormLayout>
      </CoreForm>
      <Divider sx={{ mt: 6 }} />
      <Step3Instructions />
    </Box>
  );
};

export default Step3;
