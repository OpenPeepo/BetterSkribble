import React from 'react';
import Header from '../header';
import PropTypes from 'prop-types';

const MainLayout: React.FC<React.ReactNode> = ({ children }) => (
  <div className="main-container">
    <Header />
    <div className="content-wrapper">{children}</div>
  </div>
);
MainLayout.propTypes = { children: PropTypes.node.isRequired };

export default MainLayout;