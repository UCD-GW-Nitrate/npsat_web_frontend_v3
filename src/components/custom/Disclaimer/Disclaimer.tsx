import { Flex, Image, Modal } from 'antd';
import { useEffect, useState } from 'react';

import { PRIMARY_COLOR } from '@/components/theme';
import { useGetUserPreferencesQuery } from '@/store/apis/userApi';

import { StandardText } from '../StandardText/StandardText';

export default function Disclaimer() {
  const { data } = useGetUserPreferencesQuery();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (data && !data.disclaimer_seen) {
      setOpen(true);
    }
  }, [data]);

  return (
    <Modal
      centered
      open={open}
      onOk={() => setOpen(false)}
      width={1000}
      okText="I Agree"
      closable={false}
      cancelText=" "
      cancelButtonProps={{ disabled: true, type: 'link' }}
      styles={{
        content: {
          padding: 0,
        },
        header: {
          backgroundColor: PRIMARY_COLOR,
          padding: 20,
          paddingTop: 10,
          paddingBottom: 10,
          margin: 0,
        },
        body: {
          paddingRight: 20,
          paddingLeft: 20,
          paddingTop: 0,
          paddingBottom: 0,
          margin: 0,
        },
        footer: {
          paddingRight: 24,
          paddingTop: 10,
          paddingBottom: 24,
        },
      }}
      okButtonProps={{
        size: 'large',
        style: { paddingRight: 50, paddingLeft: 50 },
      }}
      title={
        <Flex align="center" gap="large">
          <Image
            src="/images/logo-white.svg"
            height={35}
            width={(88 / 35) * 35}
            alt="NPSAT logo"
            preview={false}
          />
          <StandardText
            style={{ color: 'white', alignSelf: 'center', fontSize: 16 }}
          >
            User Agreement & Disclaimer
          </StandardText>
        </Flex>
      }
    >
      <Flex vertical justify="center">
        <StandardText variant="h3" style={{ alignSelf: 'flex-start' }}>
          Welcome to CV-NPSAT Web
        </StandardText>
        <Flex vertical>
          <StandardText style={{ fontSize: 16 }}>
            Before continuing, please review the following information:
          </StandardText>
          <ul>
            <li>
              <StandardText>
                The Nonpoint Source Assessment Toolbox (NPSAT) is a groundwater
                modeling framework designed to evaluate the fate and transport
                of nonpoint source (NPS) contaminants such as nitrate and salts
                leaching to groundwater from agricultural, urban, and natural
                land uses. Its primary application is to assess groundwater
                quality in irrigation, public, and domestic supply wells.
              </StandardText>
            </li>
          </ul>
          <ul>
            <li>
              <StandardText>
                The NPSAT framework – in contrast to other groundwater flow and
                transport models - is designed specifically (a) for
                high-resolution nonpoint source contaminant transport across
                entire groundwater (sub)basins and (b) to facilitate
                “on-the-fly” evaluation of dozens, hundreds, or thousands of
                different user-designed nonpoint source contaminant leaching
                future scenarios. These scenarios represent user-selected
                application of alternative source management practices
                associated with user-selected specific land uses and/or crops.
              </StandardText>
            </li>
          </ul>
          <StandardText style={{ fontSize: 16, textDecoration: 'underline' }}>
            By clicking "I Agree", you confirm that you have read and understood
            this information:
          </StandardText>
        </Flex>
      </Flex>
    </Modal>
  );
}
