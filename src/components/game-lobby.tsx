import React from 'react';
import PropTypes from 'prop-types';

import StylesGame from '../styles/game.module.css';

type PropType = {
    id: number
}

const GameLobby: React.FC<PropType> = ({ id }) => {
    return (
        <div className={StylesGame["canvas-wrapper"]}>
            Lobby placeholder
        </div>
    );
};

GameLobby.propTypes = {
    id: PropTypes.number.isRequired
};

export default GameLobby;