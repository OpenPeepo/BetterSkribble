import React from 'react';
import PropTypes from 'prop-types';

import StylesGame from '../../styles/game.module.css';
import GameMatch from './game-match';

type PropType = {
    id: number
}

const GameCenter: React.FC<PropType> = ({ id }) => {
    // TODO: Return lobby settings if game didn't start yet
    return (
        <div className={StylesGame["layout-center"]}>
            <GameMatch id={id} />
        </div>
    );
};

GameCenter.propTypes = {
    id: PropTypes.number.isRequired
};

export default GameCenter;