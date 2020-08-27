import React from 'react';
import PropTypes from 'prop-types';

import StylesGame from '../../styles/game.module.css';
import PlayerList from '../player-list';
import GamePopup from '../popup';
import GameCenter from './game-center';

type PropType = {
    id: number
}

const GameLayout: React.FC<PropType> = ({ id }) => {
    return (
        <div className={StylesGame["layout"]}>
            <PlayerList id={id} />
            <GameCenter id={id} />
            <GamePopup id={id} />
        </div>
    );
};

GameLayout.propTypes = {
    id: PropTypes.number.isRequired
};

export default GameLayout;