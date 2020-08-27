import React from 'react';
import PropTypes from 'prop-types';

import StylesGame from '../../styles/game.module.css';
import GameCanvas from '../game-canvas';

type PropType = {
    id: number
}

const GameMatch: React.FC<PropType> = ({ id }) => {
    return (
        <div className={StylesGame["match-wrapper"]}>
            <GameCanvas id={id} />
        </div>
    );
};

GameMatch.propTypes = {
    id: PropTypes.number.isRequired
};

export default GameMatch;