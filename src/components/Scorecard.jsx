import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, TrendingUp, Users, BarChart3, Star, Crown, Target } from 'lucide-react';

const API_BASE_URL = 'https://card-backend-three.vercel.app/api';

const Scorecard = () => {
  const [results, setResults] = useState([]);
  const [winner, setWinner] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const [resultsResponse, statsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/results`),
        fetch(`${API_BASE_URL}/stats`)
      ]);

      if (!resultsResponse.ok || !statsResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const resultsData = await resultsResponse.json();
      const statsData = await statsResponse.json();

      setResults(resultsData.results);
      setWinner(resultsData.winner);
      setStats(statsData);
    } catch (err) {
      setError('Failed to load results');
      console.error('Error fetching results:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    const interval = setInterval(fetchResults, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-500" size={24} />;
      case 2:
        return <Medal className="text-gray-400" size={24} />;
      case 3:
        return <Award className="text-amber-600" size={24} />;
      default:
        return <Target className="text-gray-500" size={20} />;
    }
  };

  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700';
    }
  };

  const getProgressBarColor = (rank) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-yellow-600';
      case 2:
        return 'from-gray-300 to-gray-500';
      case 3:
        return 'from-amber-400 to-amber-600';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={fetchResults}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const maxScore = results.length > 0 ? Math.max(...results.map(r => r.weightedScore)) : 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-2xl mb-6">
            <img src="https://iub.ac.bd/meta_logo.png" alt="IUB Logo" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
            CARD 2025 - Live Results
          </h1>
          <p className="text-gray-600 text-lg">3 Minute Thesis Competition Scorecard</p>
        </div>

        {/* Winner Announcement */}
        {winner && (
          <div className="mb-12">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl p-8 text-center text-white shadow-2xl">
              <div className="flex items-center justify-center mb-4">
                <Crown size={48} className="text-yellow-200" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Current Leader</h2>
              <div className="flex items-center justify-center space-x-4 mb-4">
                <img
                  src={winner.avatar}
                  alt={winner.name}
                  className="w-16 h-16 rounded-full border-4 border-yellow-200"
                />
                <div>
                  <h3 className="text-2xl font-bold">{winner.name}</h3>
                  <p className="text-yellow-100">{winner.role}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                <div className="bg-yellow-500/30 rounded-lg p-3">
                  <div className="text-2xl font-bold">{winner.weightedScore}</div>
                  <div className="text-sm text-yellow-100">Weighted Score</div>
                </div>
                <div className="bg-yellow-500/30 rounded-lg p-3">
                  <div className="text-2xl font-bold">{winner.yesVotes}</div>
                  <div className="text-sm text-yellow-100">Yes Votes</div>
                </div>
                <div className="bg-yellow-500/30 rounded-lg p-3">
                  <div className="text-2xl font-bold">{winner.averageIntensity}</div>
                  <div className="text-sm text-yellow-100">Avg Intensity</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="text-blue-600" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{stats.totalVotes}</div>
                  <div className="text-sm text-gray-600">Total Votes</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-green-600" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    {stats.voteDistribution.find(v => v._id === 'yes')?.count || 0}
                  </div>
                  <div className="text-sm text-gray-600">Yes Votes</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="text-red-600" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    {stats.voteDistribution.find(v => v._id === 'no')?.count || 0}
                  </div>
                  <div className="text-sm text-gray-600">No Votes</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Star className="text-purple-600" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{stats.totalParticipants}</div>
                  <div className="text-sm text-gray-600">Participants</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
              <Trophy className="text-yellow-500" size={28} />
              <span>Competition Results</span>
            </h2>
            <p className="text-gray-600 mt-1">Ranked by weighted score (Yes votes × intensity)</p>
          </div>
          
          <div className="overflow-x-auto">
            {results.length > 0 ? (
              results.map((participant, index) => (
                <div
                  key={participant.id}
                  className={`flex items-center p-6 border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${
                    participant.rank === 1 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100/50' : ''
                  }`}
                >
                  {/* Rank */}
                  <div className="flex items-center space-x-3 w-20">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${getRankBadgeColor(participant.rank)}`}>
                      {participant.rank}
                    </div>
                    {getRankIcon(participant.rank)}
                  </div>
                  
                  {/* Participant Info */}
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <img
                      src={participant.avatar}
                      alt={participant.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-800 truncate">{participant.name}</h3>
                      <p className="text-sm text-gray-600 truncate">{participant.role}</p>
                    </div>
                  </div>
                  
                  {/* Scores */}
                  <div className="flex items-center space-x-8">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-800">{participant.weightedScore}</div>
                      <div className="text-xs text-gray-500">Weighted Score</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{participant.yesVotes}</div>
                      <div className="text-xs text-gray-500">Yes Votes</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-600">{participant.noVotes}</div>
                      <div className="text-xs text-gray-500">No Votes</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {participant.averageIntensity || '0.0'}
                      </div>
                      <div className="text-xs text-gray-500">Avg Intensity</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">{participant.yesPercentage}%</div>
                      <div className="text-xs text-gray-500">Yes Rate</div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-32 ml-6">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${getProgressBarColor(participant.rank)} transition-all duration-500`}
                        style={{
                          width: `${maxScore > 0 ? (participant.weightedScore / maxScore) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">No votes yet</div>
                <div className="text-gray-400 text-sm">Results will appear as votes are submitted</div>
              </div>
            )}
          </div>
        </div>

        {/* Auto-refresh indicator */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center space-x-2 text-gray-500 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live results • Updates every 30 seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scorecard;