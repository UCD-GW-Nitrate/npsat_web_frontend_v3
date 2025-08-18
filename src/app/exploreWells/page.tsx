'use client';

import { WellsAndUrfData } from "@/components/maps/WellsAndUrfData";
import useWells, { useWellsUrfData } from "@/hooks/useWellsUrfData";
import { Region } from "@/types/region/Region";
import { Well, WellExplorerRequestDetail } from "@/types/well/WellExplorer";
import { EditFilled, EditOutlined } from "@ant-design/icons";
import { Button, Form, Select, Space } from "antd";
import { useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";

const { Option } = Select;

const ExploreWellsPage = () => {
  const [form] = Form.useForm()
  const [regions, setRegions] = useState<Region[]>([]);
  const [requestDetail, setRequestDetail] = useState<WellExplorerRequestDetail>({
    flow: "C2VSIM", 
    scen: "Pump adjusted", 
    wType: "Irrigation"
  })
  const { allWells, loading: allWellsLoading, getWellsByAgeThres } = useWells({regions, requestDetail});
  const [displayData, setDisplayData] = useState<null | Well[]>(null);
  const [wellProperty, setWellProperty] = useState<'depth' | 'unsat' | 'slmod' | 'wt2t'>('depth');

  const [eid, setEid] = useState<number | null>(null);
  const { urfData, loading: urfDataLoading } = useWellsUrfData({eid, requestDetail});

  const [mapEditing, setMapEditing] = useState(true);

  useEffect(() => {
    setDisplayData(null);
  }, [allWells])

  const onFormSubmit = (formData: FieldValues) => {
    setRegions(form.getFieldValue('regions'))
    setRequestDetail({
      flow: formData.flow,
      scen: formData.scen,
      wType: formData.wType
    })
  }


  return (
    <div>
      <Form
        form={form}
        name="control-hooks"
        onFinish={onFormSubmit}
        layout="inline"
      >
        <Form.Item name="select_regions" label="Select Regions From Map" >
          {mapEditing ?
            <Button type="link" onClick={() => setMapEditing(prev => !prev)} style={{width: 120}}>
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

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Fetch Wells
          </Button>
        </Form.Item>
      </Form>

      <div style={{width: '50%'}}>
        <WellsAndUrfData
          onSelectRegion={(regions: Region[]) => form.setFieldValue('regions', regions)}
          wellProperty={wellProperty}
          wells={displayData ? displayData : allWells}
          onSelectWell={setEid}
          urfData={urfData}
          disableRegionSelection={!mapEditing}
        />
      </div>
    </div>
  )
}

export default ExploreWellsPage;