import React from 'react';
import { useRouter } from 'next/router';
import DefaultErrorPage from 'next/error';
import Head from 'next/head';
import GameLayout from '../components/layouts/game';

const game: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    if (typeof id != 'string' || !new RegExp(`^(0|-?[1-9]+[0-9]*)$`).test(id)) return (
        <>
            <Head>
                <meta name="robots" content="noindex" />
            </Head>
            <DefaultErrorPage statusCode={404} />
        </>);
    return <GameLayout id={parseInt(id)} />;
};

export default game;