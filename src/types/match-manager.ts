import Match from "./match";

class MatchManager {
    matches: Match[];

    constructor() {
        this.matches = [];
        console.log("GameManager initialized.");
    }

    createMatch(/*mode: string*/): Match {  // Feature Co-Op matches f.e.
        return null;
    }
}

export default new MatchManager();