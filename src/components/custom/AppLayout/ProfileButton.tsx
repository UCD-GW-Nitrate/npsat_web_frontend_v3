import { Avatar } from 'antd';
import React from 'react';

interface ProfileButtonProps {
  name: string;
}

const ProfileButton = ({ name }: ProfileButtonProps) => {
  return (
    <Avatar
      size="large"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
    >
      {name[0]?.toUpperCase()}
    </Avatar>
  );
};

export default ProfileButton;
