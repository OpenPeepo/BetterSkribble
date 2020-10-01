import React, { useState, useRef, RefObject } from 'react'; // RefObject necessary?
import PropTypes from 'prop-types';

import StylesGame from '../styles/game.module.css';
import handleClientSocketEvents from '../functions/socket-client';

type PropType = {
    id: number
}

const GameCanvas: React.FC<PropType> = ({ id }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    handleClientSocketEvents(canvasRef, id);

    const currentCanvas = canvasRef.current;
    if (!currentCanvas) return;

    // Handle currentCanvas interaction (onclick, etc)

    return <canvas ref={canvasRef} width="600" height="400"></canvas>;
};

GameCanvas.propTypes = {
    id: PropTypes.number.isRequired
};

export default GameCanvas;