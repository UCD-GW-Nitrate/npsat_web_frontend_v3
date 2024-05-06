'use client';

import { Divider, Form, Select } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { type FieldValues } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { PageAdvancementButtons } from '@/components/custom/PageAdvancementButtons/PageAdvancementButtons';
import { useGetAllCropsByFlowScenarioQuery } from '@/store';
import type { Crop } from '@/store/apis/cropApi';
import type { CropModification } from '@/store/slices/modelSlice';
import {
  selectCurrentModel,
  setModelModifications,
} from '@/store/slices/modelSlice';

import type { StepBase } from '../../create/page';
import CropCard from './CropCard';
import Step3Instructions from './Step3Instructions';

interface CropDict {
  [key: string]: Crop;
}

interface LoadingDict {
  [key: string]: number;
}

const Step3 = ({ onPrev, onNext }: StepBase) => {
  const model = useSelector(selectCurrentModel);
  const { data: cropData } = useGetAllCropsByFlowScenarioQuery(1);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [cropDict, setCropDict] = useState<CropDict>({});
  const [loadingDict, setLoadingDict] = useState<LoadingDict>({});

  const [selectedCrops, setSelectedCrops] = useState<number[]>(
    model.modifications?.map((mod) => mod.crop.id) ?? [],
  );

  const formItemLayout = {
    labelCol: {
      span: 5,
    },
    wrapperCol: {
      span: 19,
    },
  };

  const onFormSubmit = (data: FieldValues) => {
    const modifications: CropModification[] = [];
    selectedCrops.forEach((c) => {
      if (cropDict[c]) {
        modifications.push({
          crop: {
            id: cropDict[c]!.id,
            name: cropDict[c]!.name,
          },
          proportion: parseFloat((data[cropDict[c]!.name] / 100).toFixed(2)),
        });
      }
    });

    dispatch(setModelModifications(modifications));
    onNext();
  };

  useEffect(() => {
    const cropDictTemp: CropDict = {};
    cropData?.results.forEach((crop) => {
      cropDictTemp[crop.id] = crop;
    });
    setCropDict(cropDictTemp);

    const loadingDictTemp: LoadingDict = {};
    model.modifications?.forEach((mod) => {
      loadingDictTemp[mod.crop.id] = mod.proportion;
    });
    setLoadingDict(loadingDictTemp);

    if (cropData && cropData.results[1] && selectedCrops.length === 0) {
      const defaultVal = cropData.results[1].id;
      setSelectedCrops([defaultVal]);
      form.setFieldValue('crop_choice', [defaultVal]);
    } else {
      form.setFieldValue('crop_choice', selectedCrops);
    }
  }, [cropData]);

  const selectedCropCards = useMemo(
    () =>
      selectedCrops.map((crop) => {
        return (
          <>
            {cropDict[crop] && (
              <Form.Item
                key={cropDict[crop]!.id}
                name={cropDict[crop]!.name}
                label=" "
                colon={false}
                rules={[
                  {
                    validator: () => Promise.resolve(),
                  },
                ]}
                initialValue={((loadingDict[crop] ?? 1) * 100).toFixed()}
              >
                <CropCard
                  crop={cropDict[crop]!}
                  initialValue={parseInt(
                    ((loadingDict[crop] ?? 1) * 100).toFixed(),
                    10,
                  )}
                  onChange={(v) => {
                    form.setFieldValue(cropDict[crop]!.name, v);
                  }}
                />
              </Form.Item>
            )}
          </>
        );
      }),
    [Object.keys(cropDict).length, selectedCrops],
  );

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        layout="horizontal"
        onFinish={onFormSubmit}
      >
        <Form.Item
          name="crop_choice"
          label="Crop(s)"
          required
          rules={[
            {
              validator: () => Promise.resolve(),
            },
          ]}
        >
          <Select
            value={selectedCrops}
            onChange={setSelectedCrops}
            mode="multiple"
            placeholder="Please select a crop to start"
          >
            {cropData?.results.map((crop) => (
              <Select.Option value={crop.id} key={crop.id}>
                {crop.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {selectedCropCards}
        <Form.Item
          style={{
            marginBottom: 8,
          }}
          wrapperCol={{
            xs: {
              span: 24,
              offset: 0,
            },
            sm: {
              span: formItemLayout.wrapperCol.span,
              offset: formItemLayout.labelCol.span,
            },
          }}
        >
          <PageAdvancementButtons canGoBack onClickPrev={onPrev} />
        </Form.Item>
      </Form>
      <Divider />
      <Step3Instructions />
    </>
  );
};

export default Step3;
