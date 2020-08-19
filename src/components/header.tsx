import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => (
  <div className="header-wrapper">
    <nav>
      <Link href="/">
        <a>Home</a>
      </Link>
      <Link href="/test">
        <a>Test</a>
      </Link>
    </nav>
  </div>
);

export default Header;