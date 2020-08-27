import React from 'react';

import StylesHome from '../styles/home.module.css';

// TODO: CSS file that somehow moves the header to the center

const index: React.FC = () => {
  return (
    <div className={StylesHome["home"]}>
      <div className={StylesHome["img-wrapper"]}>
        <img src="https://ak.picdn.net/shutterstock/videos/23666176/thumb/6.jpg" />
      </div>
      <div className={StylesHome["main-description"]}>
        Try to guess what your friends are drawing! <b>Featuring exclusive features for Twitch streamers.</b>
      </div>
    </div>);
  // TODO: Return JSX Element that contains the game info and header css
};

export default index;