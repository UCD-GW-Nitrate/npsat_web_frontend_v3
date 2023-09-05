import { Link } from '@mui/material';
import React from 'react';

import { CoreContainer } from '../core/CoreContainer/CoreContainer';
import { CoreText } from '../core/CoreText/CoreText';
import { HBox } from '../HBox/Hbox';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <div className={styles.container}>
      <CoreContainer maxWidth="lg">
        <footer>
          <HBox spacing={2} sx={{ justifyContent: 'center' }}>
            <Link
              href="http://ucanr.edu/"
              marginRight={4}
              color="inherit"
              underline="none"
            >
              Division of Agriculture and Natural Resources
            </Link>
            <Link
              href="http://groundwater.ucdavis.edu/"
              color="inherit"
              underline="none"
            >
              Groundwater
            </Link>
          </HBox>
          <CoreText align="center">
            Copywrite &copy;{' '}
            {` ${new Date().getFullYear()} Regents of the University of California`}
          </CoreText>
        </footer>
      </CoreContainer>
    </div>
  );
};

export default Footer;
