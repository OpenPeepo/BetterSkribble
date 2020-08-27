import React from 'react';
import Link from 'next/link';
import LoginStatus from './login-status';

import StylesHeader from '../styles/header.module.css';

const Header: React.FC = () => (
  <div className={StylesHeader["header"]}>
    <nav>
      <Link href="/create">
        <a className={StylesHeader["create-game"]}>Create</a>
      </Link>
      <div className={StylesHeader["login-status"]}>
        <LoginStatus />
      </div>
    </nav>
  </div>
);

export default Header;