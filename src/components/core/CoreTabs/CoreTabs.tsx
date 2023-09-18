import type { TabsProps } from '@mui/material';
import { Tab, Tabs } from '@mui/material';
import React from 'react';

export interface CoreTabProps {
  label: string;
  value?: string;
}

export interface CoreTabsProps extends TabsProps {
  tabs: CoreTabProps[];
}

export const CoreTabs = ({ tabs, ...rest }: CoreTabsProps) => {
  const [value, setValue] = React.useState(tabs[0]?.value ?? tabs[0]?.label);

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Tabs
      textColor="primary"
      indicatorColor="primary"
      {...rest}
      value={value}
      onChange={handleChange}
    >
      {tabs.map((tab: CoreTabProps) => (
        <Tab key={tab.label} label={tab.label} value={tab.value ?? tab.label} />
      ))}
    </Tabs>
  );
};
