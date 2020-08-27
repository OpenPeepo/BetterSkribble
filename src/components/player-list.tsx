import React from 'react';
import PropTypes from 'prop-types';

import StylesGame from '../styles/game.module.css';

type PropType = {
    id: number
}

const PlayerList: React.FC<PropType> = ({ id }) => {
    return (
        <div className={StylesGame["players-wrapper"]}>
            <ul>
                <li>IPatGamer</li>
                <li>xqcOW</li>
                <li>Ravenbtw</li>
                <li>Konzn_</li>
            </ul>
        </div>
    );
};

PlayerList.propTypes = {
    id: PropTypes.number.isRequired
};

export default PlayerList;