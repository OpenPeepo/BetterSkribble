import React from 'react';
import PropTypes from 'prop-types';

import StylesGame from '../styles/game.module.css';

type PropType = {
    id: number
}

const GameChat: React.FC<PropType> = ({ id }) => {
    // Chat input box and message list
    return (
        <div className={StylesGame["term-wrapper"]}>
            Chat Placeholder
        </div>
    );
};

GameChat.propTypes = {
    id: PropTypes.number.isRequired
};

export default GameChat;