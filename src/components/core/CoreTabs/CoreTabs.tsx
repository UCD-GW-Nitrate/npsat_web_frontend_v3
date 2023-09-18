import type { TabsProps } from '@mui/material';
import { Box, Tab, Tabs } from '@mui/material';
import React from 'react';

export interface CoreTabProps {
  label: string;
  value?: string;
}

export interface CoreTabsProps extends TabsProps {
  tabs: CoreTabProps[];
  onTabChange?: (tab: string) => void;
}

export const CoreTabs = ({ tabs, onTabChange, ...rest }: CoreTabsProps) => {
  const [value, setValue] = React.useState(tabs[0]?.value ?? tabs[0]?.label);

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    if (onTabChange) {
      onTabChange(newValue);
    }
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs
        textColor="primary"
        indicatorColor="primary"
        centered
        {...rest}
        value={value}
        onChange={handleChange}
      >
        {tabs.map((tab: CoreTabProps) => (
          <Tab
            key={tab.label}
            label={tab.label}
            value={tab.value ?? tab.label}
          />
        ))}
      </Tabs>
    </Box>
  );
};
