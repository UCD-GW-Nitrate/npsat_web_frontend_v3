import type { Rule } from 'antd/es/form';

const defaultRules = (message: string): Rule[] => {
  return [
    {
      required: true,
      message,
    },
  ];
};

export default defaultRules;
