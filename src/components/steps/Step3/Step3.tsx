'use client';

import { Divider, Form, Select } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { type FieldValues } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { PageAdvancementButtons } from '@/components/custom/PageAdvancementButtons/PageAdvancementButtons';
import { useGetAllCropsByFlowScenarioQuery } from '@/store';
import {
  selectCurrentModel,
  setModelModifications,
} from '@/store/slices/modelSlice';
import type { Crop } from '@/types/crop/Crop';
import type { CropModification } from '@/types/model/CropModification';

import type StepBase from '../StepBase';
import CropCard from './CropCard';
import Step3Instructions from './Step3Instructions';
import areaPerCrop, { CropAreaMap } from '@/logic/areaPerCrop';

interface CropDict {
  [key: string]: Crop;
}

interface LoadingDict {
  [key: string]: number;
}

const Step3 = ({ onPrev, onNext }: StepBase) => {
  const model = useSelector(selectCurrentModel);
  const { data: cropData } = useGetAllCropsByFlowScenarioQuery(model.load_scenario!.id);
  const [cropList, setCropList] = useState<Crop[]>([]);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [cropDict, setCropDict] = useState<CropDict>({});
  const [loadingDict, setLoadingDict] = useState<LoadingDict>({});
  const [selectedCrops, setSelectedCrops] = useState<number[]>(
    model.modifications?.map((mod) => mod.crop.id) ?? [],
  );

  var [cropAreaMap, setCropAreaMap] = useState<CropAreaMap>({});

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
          id: cropDict[c]!.id,
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
    const cropListTemp: Crop[] = [];
    cropData?.results.forEach((crop) => {
      cropDictTemp[crop.id] = crop;
      cropListTemp.push(crop);
    });
    setCropDict(cropDictTemp);
    setCropList(cropListTemp);

    const loadingDictTemp: LoadingDict = {};
    model.modifications?.forEach((mod) => {
      loadingDictTemp[mod.crop.id] = mod.proportion;
    });
    setLoadingDict(loadingDictTemp);

    if (cropData && cropData.results[1] && selectedCrops.length === 0) {
      var defaultVal = cropData.results[1].id;

      cropData.results.forEach((crop) => {
        if (crop.name === 'All Other Crops') {
          defaultVal = crop.id;
        }
      });

      setSelectedCrops([defaultVal]);
      form.setFieldValue('crop_choice', [defaultVal]);
    } else {
      form.setFieldValue('crop_choice', selectedCrops);
    }
  }, [cropData]);

  useEffect(() => {
    if (model.load_scenario!.id == 1) {
      console.log("model", model)
      console.log("cropList", cropList)
      console.log("maptype", model.regions![0]!.region_type)
  
      console.log("area per crop", areaPerCrop(model.regions![0]!.region_type, 
        model.flow_scenario!.scenario_type, 
        selectedCrops.map((crop) => cropDict[crop]!.caml_code!), 
        model.regions!.map((r) => r.mantis_id)))
      setCropAreaMap(areaPerCrop(model.regions![0]!.region_type, 
        model.flow_scenario!.scenario_type, 
        selectedCrops.map((crop) => cropDict[crop]!.caml_code!), 
        model.regions!.map((r) => r.mantis_id)));
    }
  }, [selectedCrops]);

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
                  cropArea={cropDict[crop]!.id == 1 ? cropAreaMap[1]! : cropAreaMap[cropDict[crop]!.caml_code!]!}
                  onChange={(v) => {
                    form.setFieldValue(cropDict[crop]!.name, v);
                  }}
                />
              </Form.Item>
            )}
          </>
        );
      }),
    [Object.keys(cropDict).length, Object.keys(cropAreaMap).length, selectedCrops],
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
