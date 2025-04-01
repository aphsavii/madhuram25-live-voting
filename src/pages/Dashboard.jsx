import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import dashboardService from '@/api/services/dashboard.service';

// Team colors
const teamColors = {
  'Alpha': 'bg-blue-500',
  'Beta': 'bg-pink-500',
  'Gamma': 'bg-purple-500',
  'Delta': 'bg-green-500'
};

const serverUrl = window.location.origin.includes('localhost') ? 'http://localhost:3000' : 'https://api.madhuramsliet.com';

const socket = io(serverUrl, {
  withCredentials: true,
  transports: ["websocket", "polling"],
  auth: {
    token: localStorage.getItem("token")
  }
});

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedEvent, setSelectedEvent] = useState(searchParams.get('event') ? parseInt(searchParams.get('event')) : null);
  const [performers, setPerformers] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const navigate = useNavigate();
  const [eventsData, setEventsData] = useState([]);
  const [votedPerformance, setVotedPerformance] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isjudge, setIsJudge] = useState(false);
  const [eventsVotingEnabled, setEventsVotingEnabled] = useState({});
  const [judgeScores, setJudgeScores] = useState({});
  const [lockedScores, setLockedScores] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }

    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    const data = dashboardService.getEvents().then((data) => {
      setEventsData(data.data);
      setIsAdmin(data.isAdmin);
      setIsJudge(data.isJudge);
      data.data.forEach(event => {
        setEventsVotingEnabled(prev => ({
          ...prev,
          [event.id]: event.isVotingAllowed
        }));
      });
    });
    return () => {
      socket.disconnect(); // Cleanup on unmount
    };
  }, []);

  const toggleAcceptVotings = (eventId) => {
    dashboardService.toggleAcceptVoting(eventId).then((data) => {
      console.log(data);
    });
  }



  useEffect(() => {
    if (selectedEvent) {
      dashboardService.getPerfromers(selectedEvent).then((data) => {
        setPerformers(data.data);
        const votedId = data.votedId;
        setVotedPerformance(votedId);

        // Initialize judge scores for all performers to 5 (middle value)
        const initialScores = {};
        const initialLocked = {};
        data.data.forEach(performer => {
          initialScores[performer.id] = data.judgeScores[performer.id] || 5;
          initialLocked[performer.id] = data.judgeScores[performer.id] !== undefined;
        });
        setJudgeScores(initialScores);
        setLockedScores(initialLocked);
      });

      const total = performers.reduce((sum, performer) => sum + performer.votes, 0);
      setTotalVotes(total);
    }
  }, [selectedEvent]);

  useEffect(() => {
    if (performers.length > 0) {
      const total = performers.reduce((sum, performer) => sum + performer.votes, 0);
      setTotalVotes(total);
    }
  }, [performers]);

  // Calculate percentages for each performer
  const getPercentage = (votes) => {
    if (totalVotes === 0) return 0;
    return (votes / totalVotes * 100).toFixed(1);
  };

  const votePerformer = (performerId) => {
    if (votedPerformance) return;
    if (!eventsVotingEnabled[selectedEvent] && !isjudge) return;
    socket.emit("vote", {
      performanceId: performerId,
      eventId: selectedEvent
    });
  }

  const submitJudgeScore = async (performerId) => {
    // Only allow submission if the score isn't locked
    if (lockedScores[performerId]) return;

    // Here you would add the API call to submit the judge's score
    console.log(`Submitting score ${judgeScores[performerId]} for performer ${performerId}`);

    await dashboardService.submitJudgeScore(selectedEvent, performerId, judgeScores[performerId]);

    // Lock the score after submission
    setLockedScores(prev => ({
      ...prev,
      [performerId]: true
    }));
  }

  const handleScoreChange = (performerId, value) => {
    // Only allow changes if the score isn't locked
    if (!lockedScores[performerId]) {
      setJudgeScores(prev => ({
        ...prev,
        [performerId]: value
      }));
    }
  }

  const publishResults = async () => {
    await dashboardService.publishResults(selectedEvent);
  }

  useEffect(() => {
    socket.on("vote:" + selectedEvent, (data) => {
      const performanceId = +data.performanceId;
      const votes = +data.votes;
      console.log('votes', data);
      setPerformers(prev =>
        prev.map(p => p.id === performanceId ?
          { ...p, votes } : p
        )
      );
      // setVotedPerformance(performanceId);
    });
  }, []);



  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <header className="text-center mb-12">
          <motion.h1
            className="text-4xl md:text-6xl font-primary font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0, 0.71, 0.2, 1.01]
            }}
          >
            MADHURAM'25 LIVE VOTING
          </motion.h1>
          <motion.div
            className="h-1 w-32 md:w-64 mx-auto bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "64" }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <motion.p
            className="mt-4 text-lg text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            {selectedEvent ? (isjudge ? 'Score the performances' : 'Vote for your favorite performer') : 'Select a performance category'}
            {selectedEvent && !eventsVotingEnabled[selectedEvent] && !isjudge && (<span className='text-red-600 block mt-5 text-sm lg:text-xl '> We are not accepting votes for this event currently...</span>)}
          </motion.p>
        </header>

        <AnimatePresence mode="wait">
          {!selectedEvent ? (
            <motion.div
              key="events"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {eventsData && eventsData?.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1
                  }}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)"
                  }}
                  onClick={() => {
                    console.log(event.id);
                    setSearchParams({ event: event.id.toString() });
                    setSelectedEvent(event.id);
                  }}
                  className="relative overflow-hidden bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl cursor-pointer border border-gray-700 hover:border-cyan-400 transition-colors duration-300"
                >
                  <div className={`absolute insetisVotingEnabled-0 bg-gradient-to-br ${event.color} opacity-10`}></div>
                  <motion.div
                    className="absolute -inset-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30"
                    animate={{
                      x: ["0%", "100%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "linear"
                    }}
                  />
                  <div className="p-8 text-center relative z-10">
                    {isAdmin && (
                      <div
                        className="absolute top-2 right-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAcceptVotings(event.id);
                          setEventsVotingEnabled(prev => ({
                            ...prev,
                            [event.id]: !prev[event.id]
                          }));
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-300">Voting</span>
                          <div className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${eventsVotingEnabled[event.id] ? 'bg-cyan-400' : 'bg-gray-700'}`}>
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${eventsVotingEnabled[event.id] ? 'translate-x-6' : 'translate-x-0'}`}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <span className="text-5xl mb-4 inline-block">{event.icon}</span>
                    <h2 className="text-2xl font-bold mb-2">{event.name}</h2>
                    <p className="text-gray-300">Vote for your favorite {event.name.toLowerCase()} performers</p>
                    <div className="mt-6">
                      <span className="px-4 py-2 rounded-full bg-gray-700 hover:bg-gradient-to-r from-cyan-500 to-purple-500 text-white transition-all duration-300">
                        Enter
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="performers"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="pb-16"
            >
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="mb-8 flex items-center"
              >
                <button
                  onClick={() => {
                    setSelectedEvent(null);
                    setSearchParams({});
                  }}
                  className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  <span>Back to Categories</span>
                </button>
                <h2 className="text-2xl font-bold ml-4 md:ml-8">
                  {eventsData.find(e => e.id === selectedEvent)?.name} Competition
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {performers.map((performer, index) => (
                  <motion.div
                    key={performer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`relative bg-gray-800 rounded-xl overflow-hidden border  hover:border-cyan-400 transition-all duration-300 ${votedPerformance == performer.id ? 'border-cyan-400' : 'border-gray-700'}`}
                  >
                    <div className={`absolute top-0 left-0 px-3 py-1 text-sm font-semibold ${teamColors[performer.team]} text-white`}>
                      Team {performer.team}
                    </div>

                    <motion.div
                      className="absolute top-0 right-0 mt-1 mr-1 bg-gray-900 bg-opacity-80 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        delay: index * 0.1 + 0.5
                      }}
                    >
                      <span className="text-cyan-400">{performer.votes}</span> votes
                    </motion.div>

                    <div className="p-4 pt-8">
                      <div className="w-32 h-32 mx-auto relative mb-4">
                        <motion.div
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
                          animate={{
                            rotate: 360,
                          }}
                          transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                          style={{ padding: "3px" }}
                        >
                          <img
                            src={performer.image}
                            alt={performer.name}
                            className="w-full h-full object-cover rounded-full border-2 border-gray-900"
                          />
                        </motion.div>
                      </div>

                      <h3 className="text-xl font-bold text-center mb-2">{performer.name}</h3>

                      {/* Judge-specific scoring UI */}
                      {isjudge && (
                        <div className="mt-4">
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-300 text-sm">Score: {judgeScores[performer.id]}</span>
                            <span className={`text-sm font-semibold ${lockedScores[performer.id] ? 'text-cyan-400' : 'text-gray-400'}`}>
                              {lockedScores[performer.id] ? 'Locked' : 'Unlocked'}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            step="1"
                            value={judgeScores[performer.id]}
                            onChange={(e) => handleScoreChange(performer.id, parseInt(e.target.value))}
                            disabled={lockedScores[performer.id]}
                            className={`w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 ${lockedScores[performer.id] ? 'opacity-50' : ''}`}
                          />
                          <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
                            <span>1</span>
                            <span>2</span>
                            <span>3</span>
                            <span>4</span>
                            <span>5</span>
                            <span>6</span>
                            <span>7</span>
                            <span>8</span>
                            <span>9</span>
                            <span>10</span>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => submitJudgeScore(performer.id)}
                            disabled={lockedScores[performer.id]}
                            className={`w-full mt-3 py-2 rounded-lg text-white text-sm font-bold transition-all ${lockedScores[performer.id] ? 'bg-gray-600' : 'bg-gradient-to-r from-cyan-500 to-purple-500'}`}
                          >
                            {lockedScores[performer.id] ? 'Score Locked' : 'Lock Score'}
                          </motion.button>
                        </div>
                      )}

                      {/* Regular user voting UI - only show if not a judge */}
                      {!isjudge && (
                        <>
                          <div className="mt-6">
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-300 text-sm">Vote share</span>
                              <span className="font-semibold text-sm">{getPercentage(performer.votes)}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4 overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${getPercentage(performer.votes)}%` }}
                                transition={{ duration: 1, delay: index * 0.1 + 0.2 }}
                              />
                            </div>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`w-full mt-4 py-3 rounded-lg text-white font-bold transition-transform ${eventsVotingEnabled[selectedEvent] && votedPerformance && votedPerformance != null == performer.id ? 'bg-gradient-to-r from-cyan-500 to-purple-500' : 'bg-gray-500'} ${votedPerformance == performer.id ? 'bg-gradient-to-r from-cyan-500 to-purple-500' : ''} `}
                            disabled={votedPerformance != null}
                            onClick={() => {
                              votePerformer(performer.id);
                            }}
                          >
                            {votedPerformance == performer.id ? 'Voted' : 'Vote'}
                          </motion.button>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="mt-12 bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 border border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <h3 className="text-xl font-bold mb-6">Live Results</h3>
                <div className="space-y-6">
                  {performers.map((performer, index) => (
                    <div key={`chart-${performer.id}`} className="relative">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{performer.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className={`h-3 w-3 rounded-full ${teamColors[performer.team]}`}></span>
                          <span className="text-sm font-bold">{performer.votes} votes ({getPercentage(performer.votes)}%)</span>
                          {isjudge && lockedScores[performer.id] && (
                            <span className="text-sm font-bold text-cyan-400 ml-2">
                              Your score: {judgeScores[performer.id]}/10
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-4 mb-2 overflow-hidden">
                        <motion.div
                          className={`h-full ${teamColors[performer.team]}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${getPercentage(performer.votes)}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {isAdmin && selectedEvent &&
          <motion.div
            onClick={publishResults}
            className="mt-7 cursor-pointer text-white mx-auto px-5 py-1.5 w-fit rounded-lg font-medium text-lg bg-gradient-to-r from-cyan-500 to-purple-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Publish result
          </motion.div>
        }

        <motion.footer
          className="mt-12 text-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <p>Live Voting Dashboard • {new Date().toLocaleDateString()}</p>
        </motion.footer>
      </motion.div>
    </div>
  );
};

export default Dashboard;