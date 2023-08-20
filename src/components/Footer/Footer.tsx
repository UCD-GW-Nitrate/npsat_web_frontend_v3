import { Container, Link, Typography } from '@mui/material';
import React from 'react';

import styles from './Footer.module.css';

const Footer = () => {
  return (
    <div className={styles.container}>
      <Container maxWidth="lg">
        <footer>
          <div className={styles.links}>
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
          </div>
          <Typography align="center">
            Copywrite &copy;{' '}
            {` ${new Date().getFullYear()} Regents of the University of California`}
          </Typography>
        </footer>
      </Container>
    </div>
  );
};

export default Footer;
