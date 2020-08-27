import React from 'react';
import App from 'next/app';
import MainLayout from '../components/layouts/main';
import { Provider } from 'next-auth/client';

import '../styles/_app.css';

class MyApp extends App {
  render(): JSX.Element {
    const { Component, pageProps } = this.props;

    return (
      <Provider options={
        {
          clientMaxAge: 0,
          keepAlive: 0
        }
      } session={pageProps.session} >
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </Provider>
    );
  }
}

export default MyApp;