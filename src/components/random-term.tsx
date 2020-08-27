import React from 'react';
import PropTypes from 'prop-types';

import StylesGame from '../styles/game.module.css';

type PropType = {
    id: number
}

const GameTerm: React.FC<PropType> = ({ id }) => {
    return (
        <div className={StylesGame["term-wrapper"]}>
            Word
        </div>
    );
};

GameTerm.propTypes = {
    id: PropTypes.number.isRequired
};

export default GameTerm;