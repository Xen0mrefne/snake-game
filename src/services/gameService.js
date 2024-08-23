class GameService {
    players = [];

    constructor () {

    }

    addPlayer(id) {
        this.players.push({
            id,
            name: "",
            highScore: 0,
            currentScore: 0,
        })
    }

    removePlayer(id) {
        this.players = this.players.filter(player => player.id !== id);
    }

    getPlayerList() {
        // Returns list of players without revealing socket ids
        return this.players.map(player => {
            return {name: player.name, currentScore: player.currentScore, highScore: player.highScore}
        })
    }

    getCurrentScore(id) {
        for (const player of this.players) {
            if (player.id === id) return player.currentScore;
        }
        return "Unknown";
    }

    setCurrentScore(id, score) {
        for (const player of this.players) {
            if (player.id === id) player.currentScore = score;
        }
        return score;
    }

    getHighScore(id) {
        for (const player of this.players) {
            if (player.id === id) return player.highScore;
        }
        return 0;
    }

    getPlayerName(id) {
        for (const player of this.players) {
            if (player.id === id) return player.name;
        }
        return "Unknown";
    }

    setPlayerName(id, name) {
        for (const player of this.players) {
            if (player.id === id) player.name = name;
        }
        return name;
    }

    handlePlayerScore(id) {
        for (const player of this.players) {
            if (player.id === id && player.highScore < player.currentScore) player.highScore = player.currentScore;
        }
    }
}

module.exports = GameService;