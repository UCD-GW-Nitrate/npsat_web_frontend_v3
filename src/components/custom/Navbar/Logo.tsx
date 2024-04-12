import Image from 'next/image';

const Logo = () => {
  return (
    <Image
      src="/images/logo-white.svg"
      height={35}
      width={(88 / 35) * 35}
      alt="NPSAT logo"
    />
  );
};

export default Logo;
