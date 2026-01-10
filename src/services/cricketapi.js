// src/services/cricketapi.js

// 1. We define the function clearly
export const fetchLiveMatches = async () => {
  try {
    // 2. We define the variable 'mockData' before returning it
    const mockData = [
      {
        id: '1',
        teamA: 'INDIA',
        teamB: 'AUSTRALIA',
        scoreA: '324/4',
        scoreB: 'Yet to Bat',
        overs: '45.2',
        status: 'Live',
      },
      {
        id: '2',
        teamA: 'ENGLAND',
        teamB: 'SOUTH AFRICA',
        scoreA: '210/10',
        scoreB: '15/0',
        overs: '4.0',
        status: 'Innings Break',
      }
    ];

    // 3. We return the variable we just created
    return mockData;

  } catch (error) {
    console.error("API Error:", error);
    return []; // Return an empty list if it fails, to prevent crashing
  }
};