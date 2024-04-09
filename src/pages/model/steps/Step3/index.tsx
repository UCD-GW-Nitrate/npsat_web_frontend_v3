import { Divider, Form, Select } from 'antd';
import React, { useEffect, useState } from 'react';
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

import type { StepBase } from '../../create';
import CropCard from './CropCard';
import Step3Instructions from './Step3Instructions';

interface Step3Props extends StepBase {}

const Step3 = ({ onPrev, onNext }: Step3Props) => {
  const model = useSelector(selectCurrentModel);
  const { data: cropData } = useGetAllCropsByFlowScenarioQuery(1);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const cropToString = (crop: Crop): string => {
    return `${crop.id},${crop.name},${crop.caml_code},${crop.crop_type},${crop.swat_code}`;
  };

  const stringToCrop = (s: string): Crop => {
    const arr = s.split(',');
    return {
      id: parseInt(arr[0]!, 10),
      name: arr[1]!,
      caml_code: arr[2]!,
      crop_type: parseInt(arr[3]!, 10),
      swat_code: parseInt(arr[4]!, 10),
    };
  };

  const [selectedCrops, setSelectedCrops] = useState<string[]>(
    model.modifications?.map((mod) => cropToString(mod.crop)) ?? [],
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
    console.log(data);
    const modifications: CropModification[] = [];
    selectedCrops.forEach((c) => {
      const selectedCrop = stringToCrop(c);
      modifications.push({
        crop: {
          id: selectedCrop.id,
          name: selectedCrop.name,
        },
        proportion: data[selectedCrop.name] / 100,
      });
    });

    dispatch(setModelModifications(modifications));
    onNext();
  };

  useEffect(() => {
    if (cropData && cropData.results[1] && selectedCrops.length === 0) {
      const defaultVal = cropToString(cropData.results[1]);
      setSelectedCrops([defaultVal]);
      form.setFieldValue('crop_choice', [defaultVal]);
    } else {
      form.setFieldValue('crop_choice', selectedCrops);
    }
  }, [cropData]);

  if (model.modifications) {
    console.log('Step 3 proportion', model.modifications[0]?.proportion);
  }

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
              <Select.Option value={cropToString(crop)} key={crop.id}>
                {crop.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {selectedCrops.map((crop, index) => (
          <>
            {crop && (
              <Form.Item
                key={stringToCrop(crop).id}
                name={stringToCrop(crop).name}
                label=" "
                colon={false}
                rules={[
                  {
                    validator: () => Promise.resolve(),
                  },
                ]}
                initialValue={
                  model.modifications
                    ? (model.modifications[index]?.proportion ?? 1) * 100
                    : 100
                }
              >
                <CropCard
                  crop={stringToCrop(crop)}
                  initialValue={
                    model.modifications
                      ? (model.modifications[index]?.proportion ?? 1) * 100
                      : 100
                  }
                  onChange={(v) => {
                    form.setFieldValue(stringToCrop(crop).name, v);
                  }}
                />
              </Form.Item>
            )}
          </>
        ))}
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
