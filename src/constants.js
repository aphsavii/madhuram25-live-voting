const eventsData = [
  { id: 1, name: 'Mr. Madhuram', icon: '🕴🏻', color: 'from-purple-500 to-blue-500' },
  { id: 2, name: 'Miss Madhuram', icon: '🧍🏻‍♀️', color: 'from-indigo-500 to-purple-500' },
  { id: 3, name: 'Rap', icon: '🎤', color: 'from-pink-500 to-red-500' },
  { id: 4, name: 'Poetry', icon: '📝', color: 'from-blue-500 to-cyan-500' },
  { id: 5, name: 'Beatboxing', icon: '🎵', color: 'from-green-500 to-teal-500' },
  { id: 6, name: 'Modelling', icon: '✨', color: 'from-yellow-500 to-orange-500' },
];

const performersData = {
  1: [
    { id: 101, name: 'Alex Chen', image: '/api/placeholder/200/200', votes: 0, team: 'Alpha' },
    { id: 102, name: 'Maya Johnson', image: '/api/placeholder/200/200', votes: 0, team: 'Beta' },
    { id: 103, name: 'Taron Lee', image: '/api/placeholder/200/200', votes: 0, team: 'Gamma' },
    { id: 104, name: 'Zara Williams', image: '/api/placeholder/200/200', votes: 0, team: 'Delta' }
  ],
  2: [
    { id: 201, name: 'David Kim', image: '/api/placeholder/200/200', votes: 0, team: 'Alpha' },
    { id: 202, name: 'Sophia Martinez', image: '/api/placeholder/200/200', votes: 0, team: 'Beta' },
    { id: 203, name: 'Jamal Wilson', image: '/api/placeholder/200/200', votes: 0, team: 'Gamma' },
    { id: 204, name: 'Emma Chen', image: '/api/placeholder/200/200', votes: 0, team: 'Delta' }
  ],
  3: [
    { id: 301, name: 'Kyle Brooks', image: '/api/placeholder/200/200', votes: 0, team: 'Alpha' },
    { id: 302, name: 'Jessica Patel', image: '/api/placeholder/200/200', votes: 0, team: 'Beta' },
    { id: 303, name: 'Marcus Greene', image: '/api/placeholder/200/200', votes: 0, team: 'Gamma' },
    { id: 304, name: 'Olivia Taylor', image: '/api/placeholder/200/200', votes: 0, team: 'Delta' }
  ],
  4: [
    { id: 401, name: 'Tyler Smith', image: '/api/placeholder/200/200', votes: 0, team: 'Alpha' },
    { id: 402, name: 'Aisha Johnson', image: '/api/placeholder/200/200', votes: 0, team: 'Beta' },
    { id: 403, name: 'Leo Garcia', image: '/api/placeholder/200/200', votes: 0, team: 'Gamma' },
    { id: 404, name: 'Nina Rodriguez', image: '/api/placeholder/200/200', votes: 0, team: 'Delta' }
  ],
  5: [
    { id: 501, name: 'Carlos Diaz', image: '/api/placeholder/200/200', votes: 0, team: 'Alpha' },
    { id: 502, name: 'Lily Wang', image: '/api/placeholder/200/200', votes: 0, team: 'Beta' },
    { id: 503, name: 'Finn O\'Connor', image: '/api/placeholder/200/200', votes: 0, team: 'Gamma' },
    { id: 504, name: 'Zoe Miller', image: '/api/placeholder/200/200', votes: 0, team: 'Delta' }
  ],
  6: [
    { id: 601, name: 'Amara Davis', image: '/api/placeholder/200/200', votes: 0, team: 'Alpha' },
    { id: 602, name: 'Ryan Park', image: '/api/placeholder/200/200', votes: 0, team: 'Beta' },
    { id: 603, name: 'Isabel Nguyen', image: '/api/placeholder/200/200', votes: 0, team: 'Gamma' },
    { id: 604, name: 'Jordan Clark', image: '/api/placeholder/200/200', votes: 0, team: 'Delta' }
  ]
};

export { eventsData, performersData };