import React, { useState } from 'react';
import Link from 'next/link';
import MatchList from '../components/match-list/list';
import MatchInfo from '../types/match-info';

let id = 1; // Saves across non-reloads (In-page navigation), lost on reload, per-client
let updateMatches: (match: MatchInfo) => void;
setInterval(() => {
  updateMatches({id: id, name: "Test " + id++, password: false});
}, 3000);

const test: React.FC = () => {
  const [matches, setMatches] = useState<MatchInfo[]>([]); // matches only exists in current scope. lost on navigation and reload
  updateMatches = match => setMatches([...matches, match]);

  return (
    <p>
      <MatchList matches={matches} />
      <Link href="/test">
        <a>muahaha</a>
      </Link>
    </p>
  );
};

export default test;