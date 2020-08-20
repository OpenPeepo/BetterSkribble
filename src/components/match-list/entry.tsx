import React from 'react';
import PropTypes from 'prop-types';
import MatchInfo from '../../types/match-info';

import Style from './entry.module.css';

type Props = {
    key: number,
    match: MatchInfo
}

const MatchListEntry: React.FC<Props> = ({ key, match }) => (
    <li key={key} className={Style['list-entry']}>
        {match.name}
    </li>
);
MatchListEntry.propTypes = {
    key: PropTypes.number.isRequired,
    match: PropTypes.any.isRequired
};

export default MatchListEntry;