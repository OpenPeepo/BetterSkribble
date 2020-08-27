import React from 'react';
import PropTypes from 'prop-types';

import StylesGame from '../styles/game.module.css';
import GameTerm from './random-term';
import GameChat from './chat';

type PropType = {
    id: number
}

const GamePopup: React.FC<PropType> = ({ id }) => {
    return (
        <div className={StylesGame["popup-wrapper"]}>
            <GameTerm id={id} />
            <GameChat id={id} />
        </div>
    );
};

GamePopup.propTypes = {
    id: PropTypes.number.isRequired
};

export default GamePopup;