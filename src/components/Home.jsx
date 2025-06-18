import React, { useState, useEffect } from 'react';
import { Check, X,Code , Users, BarChart3, TrendingUp, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'https://card-backend-three.vercel.app/api';
// const API_BASE_URL = 'https://card-backend.vercel.app/api';
axios.defaults.baseURL = API_BASE_URL;

const VotingCard = ({ participant, index, onSubmit, hasVoted, currentUser }) => {
  const [vote, setVote] = useState(null);
  const [likertScale, setLikertScale] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleVote = (choice) => {
    setIsAnimating(true);
    setVote(choice);
    setLikertScale(null);
    setError(null);
    if (choice === 'no') {
      setLikertScale(1);
    }
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleLikertChange = (value) => {
    setLikertScale(value);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!vote || !likertScale || !currentUser) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const voteData = {
        voterId: currentUser.id,
        voterName: currentUser.name,
        voterEmail: currentUser.email,
        participantId: participant.id,
        participantName: participant.name,
        vote,
        intensity: likertScale
      };

      const response = await axios.post('/votes', voteData);

      if (response.status === 201) {
        setTimeout(() => {
          onSubmit(participant.id, { vote, intensity: likertScale });
        }, 5000);
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
      setError(error.response?.data?.message || 'Failed to submit vote. Please Check Your Connection.');
      setIsSubmitting(false);
    }
  };

  const getIntensityColor = (value, voteType) => {
    if (voteType === 'yes') {
      return value === 1 ? 'from-emerald-400 to-green-500' :
        value === 2 ? 'from-green-500 to-emerald-600' :
          'from-green-600 to-emerald-700';
    } else {
      return value === 1 ? 'from-red-400 to-rose-500' :
        value === 2 ? 'from-red-500 to-rose-600' :
          'from-red-600 to-rose-700';
    }
  };

  if (hasVoted) return null;

  return (
    <div
      className="group relative bg-white shadow-xl rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {vote && (
        <div className={`absolute top-0 right-0 w-16 h-16 ${vote === 'yes' ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-gradient-to-br from-red-400 to-rose-500'
          } transform rotate-45 translate-x-8 -translate-y-8 transition-all duration-300`}>
          <div className="absolute bottom-2 left-2 text-white">
            {vote === 'yes' ? <Check size={12} /> : <X size={12} />}
          </div>
        </div>
      )}

      <div className="relative z-10">
        <div className="flex items-center md:p-8 p-2">
          <div className="flex  md:flex-row flex-col items-center space-y-2 " >
            <div className="relative">
              <img
                className="h-20 w-20 rounded-full object-cover ring-4 ring-white shadow-lg transition-transform duration-300 group-hover:scale-105"
                src={participant.avatar}
                alt={`${participant.name}'s avatar`}
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="ml-6 flex-grow">
              <h3 className="text-xl font-bold text-blue-900 group-hover:text-gray-900 transition-colors">
                {participant.name}
              </h3>
              <p className="text-gray-600  font-semibold">{participant.role}</p>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <Users size={14} className="mr-1" />
                <span>ID: {participant.id}</span>
              </div>
            </div>
          </div>


          <div className="flex flex-col items-center">
            {vote && likertScale ? (
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${vote === 'yes' ? 'from-green-400 to-emerald-500' : 'from-red-400 to-rose-500'
                  } flex items-center justify-center text-white font-bold shadow-lg`}>
                  {likertScale}
                </div>
                <span className="text-xs text-gray-500 mt-1">Ready</span>
              </div>
            ) : vote ? (
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full ${vote === 'yes' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  } flex items-center justify-center`}>
                  {vote === 'yes' ? <Check size={16} /> : <X size={16} />}
                </div>
                <span className="text-xs text-gray-500 mt-1">Pending</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
                <span className="text-xs text-gray-500 mt-1">Waiting</span>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mx-8 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle size={16} />
              <span className="text-sm font-medium">{error}</span>
            </div>
          </div>
        )}

        <div className="px-8 pb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => handleVote('yes')}
              disabled={isSubmitting}
              className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${vote === 'yes'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-200'
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-green-50 hover:to-emerald-50 hover:text-green-700 hover:shadow-md'
                } ${isAnimating && vote === 'yes' ? 'animate-pulse' : ''} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Check size={18} />
                <span>Yes</span>
              </div>
            </button>
            <button
              onClick={() => handleVote('no')}
              disabled={isSubmitting}
              className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${vote === 'no'
                  ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-200'
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-red-50 hover:to-rose-50 hover:text-red-700 hover:shadow-md'
                } ${isAnimating && vote === 'no' ? 'animate-pulse' : ''} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center justify-center space-x-2">
                <X size={18} />
                <span>No</span>
              </div>
            </button>
          </div>
        </div>

        {vote === 'yes' && (
          <div className="px-8 pb-8 border-t border-gray-100 pt-6 animate-in slide-in-from-bottom duration-300">
            <div className="text-center mb-6">
              <p className="font-semibold text-gray-700 mb-2">
                How strongly do you agree?
              </p>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto"></div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((value) => (
                <button
                  key={value}
                  onClick={() => handleLikertChange(value)}
                  disabled={isSubmitting}
                  className={`relative overflow-hidden py-4 px-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${likertScale === value
                      ? `bg-gradient-to-r ${getIntensityColor(value, vote)} text-white shadow-lg`
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="relative z-10 text-center">
                    <div className={`text-2xl font-bold mb-1 ${likertScale === value ? 'text-white' : 'text-green-600'
                      }`}>
                      {value}
                    </div>
                    <div className="text-xs leading-tight">
                      {value === 1 && 'Slightly agree'}
                      {value === 2 && 'Agree'}
                      {value === 3 && 'Strongly agree'}
                    </div>
                  </div>

                  {likertScale === value && (
                    <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={handleSubmit}
                disabled={!vote || !likertScale || isSubmitting}
                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform ${!vote || !likertScale || isSubmitting
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
                  }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Check size={18} />
                    <span>Submit Vote</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        )}

        {vote === 'no' && (
          <div className="px-8 pb-8 border-t border-gray-100 pt-6 animate-in slide-in-from-bottom duration-300">
            {/* <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-rose-600 rounded-full mb-4">
                <X className="text-white" size={24} />
              </div>
              <p className="font-semibold text-gray-700 mb-2">
                Vote recorded as "No"
              </p>
              <p className="text-sm text-gray-500">
                Ready to submit your disagreement
              </p>
            </div> */}

            <div className="mt-4">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform ${isSubmitting
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
                  }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <X size={18} />
                    <span>Submit No Vote</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Home = () => {
  const [mounted, setMounted] = useState(false);
  const [availableParticipants, setAvailableParticipants] = useState([]);
  const [votedParticipants, setVotedParticipants] = useState(new Set());
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock user data - you can replace this with your own user management
  const currentUser = {
    id: 'user_' + Math.random().toString(36).substr(2, 9),
    name: 'Mekat',
    email: 'voter@example.com',
    photoURL: 'https://randomuser.me/api/portraits/men/1.jpg'
  };
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const fetchAvailableParticipants = async () => {
    try {
      setLoading(true);
      setError(null);
      await sleep(1000);
      // This endpoint now automatically filters based on admin visibility settings
      const response = await axios.get(`/participants/available/${currentUser.id}`);
      const participants = response.data;

      setAvailableParticipants(participants);

      const userVotesResponse = await axios.get(`/votes/user/${currentUser.id}`);
      const userVotes = userVotesResponse.data;

      const votedIds = new Set(userVotes.map(vote => vote.participantId));
      setVotedParticipants(votedIds);
      setTotalVotes(userVotes.length);

    } catch (error) {
      console.error('Error fetching participants:', error);
      setError('Check Your Internet Connection and Try Again');
    } finally {
      setLoading(false);
    }
  };

  const handleUserSubmit = (participantId, voteData) => {
    setVotedParticipants(prev => new Set([...prev, participantId]));
    setTotalVotes(prev => prev + 1);
    setAvailableParticipants(prev =>
      prev.filter(participant => participant.id !== participantId)
    );
  };

  useEffect(() => {
    setMounted(true);
    fetchAvailableParticipants();
    fetchTotalEnabledCount();
  }, []);

  const [totalEnabledParticipants, setTotalEnabledParticipants] = useState(8);
  const completionPercentage = Math.round((totalVotes / totalEnabledParticipants) * 100);

  const fetchTotalEnabledCount = async () => {
    try {
      const response = await axios.get('/admin/enabled-participants');
      setTotalEnabledParticipants(response.data.totalEnabled);
    } catch (error) {
      console.error('Error fetching enabled participants count:', error);
      // Fallback to default if error
      setTotalEnabledParticipants(8);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading voting data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-2 pb-10">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-red-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Connection Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchAvailableParticipants}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 pt-12 pb-8">
        <div className="flex flex-row items-center justify-center mb-12 gap-6">
          <div className="flex items-center justify-center">
            <img src="https://iub.ac.bd/meta_logo.png" alt="IUB Logo" className="w-32 h-32 object-contain" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
              CARD 2025
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl">
              3 Minute Thesis People's Choice Award Voting
            </p>
          </div>
        </div>

        {/* <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
            <img 
              src={currentUser.photoURL} 
              alt="User avatar" 
              className="w-8 h-8 rounded-full"
            />
            <span className="font-medium text-gray-700">{currentUser.name}</span>
          </div>
        </div> */}

        {/* <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-600">Your Progress:</span>
            <span className="text-lg font-bold text-blue-600">{totalVotes}/{totalEnabledParticipants}</span>
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-600">{completionPercentage}%</span>
          </div>
        </div> */}
      </div>

      <div className="container mx-auto px-4 pb-12">
        {availableParticipants.length > 0 ? (
          <div className={`grid gap-8 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
            {availableParticipants.map((participant, index) => (
              <VotingCard
                key={participant.id}
                participant={participant}
                index={index}
                onSubmit={handleUserSubmit}
                hasVoted={votedParticipants.has(participant.id)}
                currentUser={currentUser}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mb-6">
              <Check className="text-white" size={40} />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">All Votes Submitted!</h2>
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              Thank you for participating in the CARD 2025 - 3 Minute Thesis voting. Your votes have been recorded.
            </p>
            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl max-w-md mx-auto">
              <div className="text-2xl font-bold text-green-600 mb-2">{totalVotes} / {totalEnabledParticipants}</div>
              <div className="text-sm text-green-700">Votes Successfully Submitted</div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white/50 mt-28 md:mt-80 backdrop-blur-sm border-t border-gray-200">
  <div className="container mx-auto px-4 py-6 text-center">
    <div className="flex items-center justify-center space-x-2 text-gray-500 mb-2">
      <Code size={16} />
      <p className="text-sm">
        Powered by{' '}
        <a
          href="https://github.com/phanthom-Mekat"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline text-green-600 hover:underline transition-colors"
        >
          Mekat
        </a>
        {' & '}
        <a
          href="https://github.com/samZero-0"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline text-blue-600 hover:underline transition-colors"
        >
          Samin
        </a>
      </p>
    </div>
    <p className="text-xs text-gray-500">
      Department of Computer Science and Engineering, IUB
    </p>
    
  </div>
</div>
    </div>
  );
};

export default Home;