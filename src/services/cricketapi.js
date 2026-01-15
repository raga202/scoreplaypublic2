// src/services/cricketapi.js

const DATA_STORE = {
  matches: [
    {
      id: '1',
      teamA: 'INDIA',
      teamB: 'NEW ZEALAND',
      scoreA: '306/6',
      scoreB: '300/8',
      overs: '49.0',
      status: 'India won by 4 wickets', // Jan 11, 2026 result
      description: '1st ODI - Vadodara'
    },
    {
      id: '2',
      teamA: 'RCB',
      teamB: 'CSK',
      scoreA: '185/3',
      scoreB: 'Yet to Bat',
      overs: '20.0',
      status: 'Live',
      description: 'IPL 2026 - Opening Match'
    }
  ],
  matchDetails: {
    '1': {
      teamA: 'INDIA',
      teamB: 'NEW ZEALAND',
      scoreA: '306/6',
      status: 'Kohli 28k milestone reached!',
      recentBalls: ['4', '1', '6', '1', '1', '2'],
      batsmen: [
        { name: 'V. Kohli', runs: '93', balls: '78', isStriker: true },
        { name: 'K.L. Rahul', runs: '34', balls: '22', isStriker: false }
      ],
      bowler: { name: 'Aditya Ashok', figures: '1/55 (10.0)' }
    }
  },
  players: [
    {
      id: '101',
      name: "Virat Kohli",
      role: "Batter",
      team: "IND",
      stats: { matches: 556, runs: 28068, average: 52.5, strikeRate: 139.1 },
      recentScores: [93, 82, 45, 101, 33]
    }
  ],
  rewards: [
    { id: '1', title: 'Cameron Green KKR Jersey', cost: 6000, type: 'Physical' },
    { id: '2', title: 'IPL 2026 Season Pass', cost: 15000, type: 'Ticket' }
  ]
};

export const fetchLiveScores = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(DATA_STORE.matches), 500); 
  });
};

export const fetchLiveMatches = fetchLiveScores; // Alias for compatibility

export const fetchMatchDetail = async (matchId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const detail = DATA_STORE.matchDetails[matchId];
      resolve(detail || DATA_STORE.matchDetails['1']);
    }, 500);
  });
};

export const fetchPlayerProfile = async (playerId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
        const player = DATA_STORE.players.find(p => p.id === playerId);
        resolve(player || DATA_STORE.players[0]);
    }, 500);
  });
};

export const fetchRewards = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(DATA_STORE.rewards), 500);
    });
};