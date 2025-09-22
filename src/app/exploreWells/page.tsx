'use client';

import LineChart from "@/components/charts/LineChart/LineChart";
import Scatterplot from "@/components/charts/Scatterplot/Scatterplot";
import AppLayout from "@/components/custom/AppLayout/AppLayout";
import CustomSlider from "@/components/custom/CustomSlider/CustomSlider";
import { InfoContainer } from "@/components/custom/InfoContainer/InfoContainer";
import { VBox } from "@/components/custom/VBox/VBox";
import useWells, { useWellsUrfData } from "@/hooks/useWellsUrfData";
import { ADEurf } from "@/logic/ExploreModelWells/ADEurf";
import { Region } from "@/types/region/Region";
import { Well, WellExplorerRequestDetail } from "@/types/well/WellExplorer";
import { DownOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Card, Col, Dropdown, Form, MenuProps, Row, Select, Space } from "antd";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { FieldValues } from "react-hook-form";

const WellsAndUrfData = dynamic(() => import("@/components/maps/WellsAndUrfData"), {
  ssr: false,
});
const { Option } = Select;

const dropdownItems = [
  {
    label: 'Depth',
    key: 'depth',
  },
  {
    label: 'Unsat',
    key: 'unsat',
  },
  {
    label: 'WT2T',
    key: 'wt2t',
  },
  {
    label: 'SL',
    key: 'slmod',
  },
];

const dropdownLabels = Object.fromEntries(dropdownItems.map(item => [item.key, item.label]));

const ExploreWellsPage = () => {
  const [form] = Form.useForm()
  const [regions, setRegions] = useState<Region[]>([]);
  const [requestDetail, setRequestDetail] = useState<WellExplorerRequestDetail>({
    flow: "C2VSim", 
    scen: "Pump adjusted", 
    wType: "Irrigation"
  })
  const { allWells, loading: allWellsLoading, getWellsByAgeThres } = useWells({regions, requestDetail});
  const [displayData, setDisplayData] = useState<null | Well[]>(null);
  const [wellProperty, setWellProperty] = useState<'depth' | 'unsat' | 'slmod' | 'wt2t'>('depth');
  const [ageThres, setAgeThres] = useState(0);
  const [porosity, setPorosity] = useState(0.2);

  const [eid, setEid] = useState<number | null>(null);
  const { urfData, loading: urfDataLoading } = useWellsUrfData({eid, requestDetail});

  const [mapEditing, setMapEditing] = useState(true);

  useEffect(() => {
    setDisplayData(null);
  }, [allWells])

  const onFormSubmit = (formData: FieldValues) => {
    if (form.getFieldValue('regions')) {
      setRegions(form.getFieldValue('regions'))
      setMapEditing(false)
    }
    setRequestDetail({
      flow: formData.flow,
      scen: formData.scen,
      wType: formData.wType
    })

    if (!form.getFieldValue('regions') || form.getFieldValue('regions').length == 0) {
      form.setFields([
        {
          name: "select_regions",
          errors: ["Please select at least 1 Region"],
        },
      ]);
      setMapEditing(true)
    }
  }

  const [depthAgeChart, ecdfChart, urfChart] = useMemo(() => {
      let depthAgeValues = [];
      let depthAgeSeries: ApexAxisChartSeries = [];
      let urfSeries: ApexAxisChartSeries = [];
      let ecdfValues: [number, number][] = [];
      let ecdfSeries: ApexAxisChartSeries = [];
      let ages: number[] = [];
      for (const reactionPoint of urfData){
        let age = reactionPoint.ageA * porosity + reactionPoint.ageB;
        ages.push(age);
        depthAgeValues.push([reactionPoint.wt2d, age]);
        urfSeries.push({name: reactionPoint.sid.toString(), type: 'line', data: ADEurf(reactionPoint.len, age, 500)});
      }

      depthAgeSeries.push({name:'Depth - Age', data: depthAgeValues});

      ages.sort((a,b)=>a-b);
      for (let i = 0; i < ages.length; i++){
        ecdfValues.push([ages[i]!, 100*i/ages.length]);
      }
      ecdfSeries.push({name: 'ECDF', data: ecdfValues ?? []});
      console.log(urfSeries)
      return [ depthAgeSeries, ecdfSeries, urfSeries ]
    }, 
    [urfData]
  );

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    console.log('click', e);
    setWellProperty(e.key)
  };
  
  const menuProps = {
    items: dropdownItems,
    onClick: handleMenuClick,
  };

  useEffect(() => {
      async function refetchWells () { ageThres==0 ? setDisplayData(allWells) : setDisplayData(await getWellsByAgeThres(ageThres, porosity) ?? []) }
      if (!allWellsLoading) { refetchWells() }
    },
    [allWellsLoading, ageThres, porosity]
  )


  return (
    <AppLayout>
      <Form
        form={form}
        name="control-hooks"
        onFinish={onFormSubmit}
        layout="inline"
        style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, paddingBottom: 40}}
      >
        <Form.Item name="select_regions" label="Select Region(s) From Map" required rules={[]} >
          {mapEditing ?
            <Button type="link" onClick={() => { setMapEditing(prev => !prev); form.setFields([{ name: "select_regions", errors: undefined }]); }} style={{width: 120}}>
              Cancel Edit Mode
            </Button> 
            :
            <Button type="link" onClick={() => setMapEditing(prev => !prev)} style={{width: 120}}>
              Edit Selection
              <EditOutlined />
            </Button>
          }
        </Form.Item>

        <Form.Item name="flow" label="Base Model" rules={[{ required: true }]}>
          <Select style={{ width: 120 }}>
            <Option value="C2VSim">C2VSim</Option>
            <Option value="CVHM2">CVHM2</Option>
          </Select>
        </Form.Item>

        <Form.Item name="scen" label="Scenario" rules={[{ required: true }]}>
          <Select style={{ width: 180 }}>
            <Option value="Pump adjusted">Pump adjusted</Option>
            <Option value="Recharge adjusted">Recharge adjusted</Option>
          </Select>
        </Form.Item>

        <Form.Item name="wType" label="Well Type" rules={[{ required: true }]}>
          <Select
            style={{ width: 120 }}
          >
            <Option value="Irrigation">Irrigation</Option>
            <Option value="Domestic">Domestic</Option>
          </Select>
        </Form.Item>

        <Form.Item style={{paddingLeft: 100}}>
          <Button type="primary" htmlType="submit">
            Fetch Wells
          </Button>
        </Form.Item>
      </Form>
      <VBox spacing="large">
        <Row gutter={[24, 8]} style={{width: '100%'}}>
          <Col span={12}>
            <div style={{width: '100%'}}>
              <WellsAndUrfData
                onSelectRegion={(regions: Region[]) => { if (regions.length > 0) form.setFields([{ name: "select_regions", errors: undefined }]); form.setFieldValue('regions', regions) }}
                wellProperty={wellProperty}
                wells={displayData ? displayData : allWells}
                onSelectWell={setEid}
                urfData={urfData}
                disableRegionSelection={!mapEditing}
              />
            </div>
          </Col>
          <Col span={12} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Card style={{ width: '100%', display: 'flex', flexDirection: 'column', marginBottom: 10 }} title="Change Data Display:">
              <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 0}}>
                <p style={{width: 250, paddingRight: 20}}>Colorcode by Well Property:</p>
                <Dropdown menu={menuProps}>
                  <Button>
                    {dropdownLabels[wellProperty]}
                    <Space>
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
              </div>
            </Card>
            <Card style={{ width: '100%', display: 'flex', flexDirection: 'column', marginBottom: 30 }} title="Filter by Age Fraction:" extra={<div>Displaying {displayData?.length ?? allWells.length} of {allWells.length} fetched Wells</div>}>
              <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                <p style={{width: 250, paddingRight: 20}}>Set Minimum Age Thres:</p>
                <CustomSlider value={ageThres} onAfterChange={async (val) => { setAgeThres(val) }} />
              </div>
              <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                <p style={{width: 250, paddingRight: 20}}>Set Porosity:</p>
                <CustomSlider value={porosity} onAfterChange={async (val) => { setPorosity(val) }} maxValue={0.9} />
              </div>
            </Card>
          </Col>
        </Row> 

        <InfoContainer title={allWells.length==0 ? "Select a well to get started" : "Well Streampoints Data"}>
          <Row gutter={[24, 16]} style={{width: '100%'}}>
            <Col span={12}>
              <Scatterplot data={depthAgeChart} title="Depth vs Age" />
            </Col>
            <Col span={12}>
              <LineChart data={ecdfChart} title="ECDF" />
            </Col>
            <Col span={12}>
              <LineChart data={urfChart}title="URFs" />
            </Col>
          </Row>
        </InfoContainer>
      </VBox>
    </AppLayout>
  )
}

export default ExploreWellsPage;