import React from 'react';
import PropTypes from 'prop-types';

import StylesGame from '../styles/game.module.css';

type PropType = {
    id: number
}

const GameCanvas: React.FC<PropType> = ({ id }) => {
    return (
        <div className={StylesGame["canvas-wrapper"]}>
            <canvas width="600" height="400"></canvas>
        </div>
    );
};

GameCanvas.propTypes = {
    id: PropTypes.number.isRequired
};

export default GameCanvas;