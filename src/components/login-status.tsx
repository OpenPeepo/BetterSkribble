import React from 'react';
import Link from 'next/link';
import UserAvatar from './user-avatar';

const LoginStatus: React.FC = () => {
    const token_login = 1;  // TODO, next-auth (try staying up-to-date with next-auth PR merge on DefinitelyTyped) IF NECESSARY.
                        // (Look into next-auth authentication methods more)
                        // npm i @types/next-auth

    if (token_login) {
        return <UserAvatar token={token_login}/>;
    } else {
        return (
            <Link href="/login">
                <a className="button button-login">Login</a>
            </Link>
        );
    }
};

export default LoginStatus;