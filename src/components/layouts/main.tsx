import React from 'react';
import Header from '../header';
import PropTypes from 'prop-types';

import StylesMainLayout from '../../styles/main-layout.module.css';

const MainLayout: React.FC<React.ReactNode> = ({ children }) => (
  <div className="main-container">
    <div className={StylesMainLayout["header"]}>
      <Header />
    </div>
    <div className={StylesMainLayout["content-wrapper"]}>
      <div className={StylesMainLayout["content"]}>{children}</div>
    </div>
  </div>
);
MainLayout.propTypes = { children: PropTypes.node.isRequired };

export default MainLayout;