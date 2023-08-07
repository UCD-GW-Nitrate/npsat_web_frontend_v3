import { ButtonBase } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';

const Logo = () => {
  const router = useRouter();

  return (
    <ButtonBase
      onClick={() => {
        router.replace('/');
      }}
      disableRipple
    >
      <Image
        src="/images/logo.svg"
        height={35}
        width={(88 / 35) * 35}
        alt="NPSAT logo"
      />
    </ButtonBase>
  );
};

export default Logo;
