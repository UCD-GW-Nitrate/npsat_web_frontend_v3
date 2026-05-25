'use client';

import { ExportOutlined } from '@ant-design/icons';
import type { TourProps } from 'antd';
import { Col, Empty, Form, message, Row, Tour, Typography } from 'antd';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { FieldValues } from 'react-hook-form';

import LineChart from '@/components/charts/LineChart/LineChart';
import Scatterplot from '@/components/charts/Scatterplot/Scatterplot';
import AppLayout from '@/components/custom/AppLayout/AppLayout';
import ExploreWellsSteps from '@/components/custom/ExploreWellsSteps/ExploreWellsSteps';
import { InfoContainer } from '@/components/custom/InfoContainer/InfoContainer';
import { StandardText } from '@/components/custom/StandardText/StandardText';
import { VBox } from '@/components/custom/VBox/VBox';
import WellExplorerMap from '@/components/maps/WellExplorerMap';
import useWells, { useWellsUrfData } from '@/hooks/useWellsUrfData';
import { ADEurf } from '@/logic/ExploreModelWells/ADEurf';
import {
  useGetUserPreferencesQuery,
  useUpdateUserPreferencesMutation,
} from '@/store/apis/userApi';
import type { Region } from '@/types/region/Region';
import type { WellExplorerRequestDetail } from '@/types/well/WellExplorer';

const ExploreWellsPage = () => {
  // use a form to track in-progress param-selections until Fetch Wells is pressed
  const [form] = Form.useForm();
  // allows user to toggle between well selection and region selection on map
  const [mapEditing, setMapEditing] = useState(true);

  // final params which will be set with form-values during onFormSuubmit
  const [regions, setRegions] = useState<Region[]>([]);
  const [requestDetail, setRequestDetail] = useState<WellExplorerRequestDetail>(
    {
      flow: 'C2VSim',
      scen: 'Pump adjusted',
      wType: 'Irrigation',
    },
  );

  const {
    allWells,
    loading: allWellsLoading,
    getWellsByAgeThres,
  } = useWells({ regions, requestDetail });

  const [messageApi, contextHolder] = message.useMessage();
  const error = () => {
    messageApi.open({
      type: 'error',
      content: 'Please select at least 1 region on the map',
    });
  };

  // handle Fetch Wells button press
  const onFormSubmit = (formData: FieldValues) => {
    if (form.getFieldValue('regions')) {
      setRegions(form.getFieldValue('regions'));
      setMapEditing(false);
    }

    setRequestDetail({
      flow: formData.flow,
      scen: formData.scen,
      wType: formData.wType,
    });

    if (
      !form.getFieldValue('regions') ||
      form.getFieldValue('regions').length === 0
    ) {
      error();
      form.setFields([
        {
          name: 'select_regions',
          errors: ['Please select at least 1 Region'],
        },
      ]);
      setMapEditing(true);
    }
  };

  // param used to filter wells by ageThres and also graph depth vs age
  const [porosity, setPorosity] = useState(0.2);

  // state variables related to the action of selecting a well on the map
  const [eid, setEid] = useState<number | null>(null);
  const { urfData, loading: urfDataLoading } = useWellsUrfData({
    eid,
    requestDetail,
  });

  // create charts when new urf data has been fetched (after a diff well was clicked) or porosity changed
  const [depthAgeChart, ecdfChart, urfChart] = useMemo(() => {
    const depthAgeValues = [];
    const depthAgeSeries: ApexAxisChartSeries = [];

    const urfSeries: ApexAxisChartSeries = [];

    const ecdfValues: [number, number][] = [];
    const ecdfSeries: ApexAxisChartSeries = [];

    const ages: number[] = [];

    for (const reactionPoint of urfData) {
      const age = reactionPoint.ageA * porosity + reactionPoint.ageB;
      ages.push(age);
      depthAgeValues.push([reactionPoint.wt2d, age]);
      urfSeries.push({
        name: reactionPoint.sid.toString(),
        type: 'line',
        data: ADEurf(reactionPoint.len, age, 500),
      });
    }

    depthAgeSeries.push({ name: 'Depth - Age', data: depthAgeValues });

    ages.sort((a, b) => a - b);
    for (let i = 0; i < ages.length; i += 1) {
      ecdfValues.push([ages[i]!, (100 * i) / ages.length]);
    }
    ecdfSeries.push({ name: 'ECDF', data: ecdfValues ?? [] });

    return [depthAgeSeries, ecdfSeries, urfSeries];
  }, [urfData, porosity]);

  // fetch user preferences, which contain if the user has visited this page before
  const { data: userPreferences, refetch } = useGetUserPreferencesQuery();

  // function to toggle user preferences once tour is completed for the first time
  const [updateUserPreferences] = useUpdateUserPreferencesMutation();

  // references to the 4 components of the Tour
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);

  // state variables related to displaying the Tour
  const [open, setOpen] = useState<boolean>(false);
  const [current, setCurrent] = useState<number>(0);
  const steps: TourProps['steps'] = [
    {
      title: 'API Params',
      description:
        'Configure from which dataset you would like to fetch wells.',
      target: () => ref1.current,
    },
    {
      title: 'Map',
      description:
        'Select region(s) on this map as an API param. Once fetched, well data points will appear here.',
      target: () => ref2.current,
      scrollIntoViewOptions: {
        behavior: 'instant',
        block: 'center',
      },
    },
    {
      title: 'Results',
      description: 'Change how or which data points are displayed.',
      target: () => ref3.current,
      scrollIntoViewOptions: {
        behavior: 'instant',
        block: 'center',
      },
    },
    {
      title: 'Well Streampoints Data',
      description:
        'Click on a particular well from the map to populate Depth-Age, ECDF, and URF charts.',
      target: () => ref4.current,
      scrollIntoViewOptions: {
        behavior: 'instant',
        block: 'center',
      },
    },
  ];

  // check if user has already landed on this page, if not, start the Tour
  useEffect(() => {
    if (userPreferences && !userPreferences.expl_wells_tour_complete) {
      setOpen(true);
    }
  }, [userPreferences]);

  function handleFinishTour() {
    updateUserPreferences({ expl_wells_tour_complete: true });
    refetch();
    setOpen(false);
  }

  return (
    <AppLayout>
      {contextHolder}
      <StandardText variant="h1" style={{ marginTop: 10 }}>
        Explore Wells
      </StandardText>

      <div ref={ref1}>
        <ExploreWellsSteps
          form={form}
          onFormSubmit={onFormSubmit}
          mapEditing={mapEditing}
          setMapEditing={setMapEditing}
        />
      </div>

      <VBox spacing="large">
        <WellExplorerMap
          mapEditing={mapEditing}
          allWells={allWells}
          allWellsLoading={allWellsLoading}
          getWellsByAgeThres={getWellsByAgeThres}
          form={form}
          porosity={porosity}
          setPorosity={setPorosity}
          setEid={setEid}
          urfData={urfData}
          mapRef={ref2}
          mapFiltersRef={ref3}
        />

        <div ref={ref4}>
          <InfoContainer title="Well Streampoints Data">
            {eid == null ? (
              <Empty
                description={
                  <Typography.Text>
                    Please select a well from the map to get started
                  </Typography.Text>
                }
              />
            ) : (
              <Row gutter={[24, 16]} style={{ width: '100%' }}>
                <Col span={12}>
                  <Scatterplot
                    data={depthAgeChart}
                    title="Depth vs Age"
                    xTitle="Depth (m)"
                    yTitle="Age (years)"
                  />
                </Col>
                <Col span={12}>
                  <LineChart
                    data={ecdfChart}
                    title="ECDF"
                    xTitle="Age (years)"
                    yTitle="Percentage"
                    variant="numeric"
                  />
                </Col>
                <Col span={12}>
                  <LineChart
                    data={urfChart}
                    title="URFs"
                    xTitle="Time (years)"
                    variant="numeric"
                  />
                </Col>
              </Row>
            )}
          </InfoContainer>
        </div>

        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
            paddingRight: 20,
          }}
        >
          <Link
            href="https://giorgk.users.earthengine.app/view/cv-unsat"
            target="_blank"
          >
            {'Explore Central Valley Unsaturated Travel Time (Google Earth) '}
            <ExportOutlined />
          </Link>
        </div>
      </VBox>

      <Tour
        open={open}
        steps={steps}
        current={current}
        onChange={setCurrent}
        onClose={() => handleFinishTour()}
        onFinish={() => handleFinishTour()}
      />
    </AppLayout>
  );
};

export default ExploreWellsPage;
