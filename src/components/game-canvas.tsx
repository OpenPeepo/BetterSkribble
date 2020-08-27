import React from 'react';
import PropTypes from 'prop-types';

import StylesGame from '../styles/game.module.css';
import useSocket from '../hooks/use-socket';

type PropType = {
    id: number
}

const GameCanvas: React.FC<PropType> = ({ id }) => {
    const generateSocketEventName = (eventName: string) => `game.${id}.${eventName}`;

    useSocket(generateSocketEventName("draw"), (x: number, y: number) => {
        return x + y;
    });

    return <canvas width="600" height="400"></canvas>;
};

GameCanvas.propTypes = {
    id: PropTypes.number.isRequired
};

export default GameCanvas;