import React from 'react';
import PropTypes from 'prop-types';
import MatchListEntry from './entry';
import MatchInfo from '../../types/match-info';

type Props = {
    matches: MatchInfo[],
    matchPredicate?(match: MatchInfo): boolean;
}

const MatchList: React.FC<Props> = ({ matches, matchPredicate }) => {
    const renderMatches: JSX.Element[] = [];
    matches.forEach((match, i) => {
        if (!matchPredicate || matchPredicate(match)) renderMatches.push(
            <MatchListEntry key={i} match={match} />
        );
    });

    return (
        <ol>
            {renderMatches}
        </ol>
    );
};

MatchList.propTypes = {
    matches: PropTypes.array.isRequired,
    matchPredicate: PropTypes.func
};

export default MatchList;