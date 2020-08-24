import React from 'react';
import Link from 'next/link';
import HeaderLogin from './header-login';

const Header: React.FC = () => (
  <div className="header-wrapper">
    <nav>
      <Link href="/create">
        <a className="button button-create">Create</a>
      </Link>
      <HeaderLogin />
    </nav>
  </div>
);

export default Header;