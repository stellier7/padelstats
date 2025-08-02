import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiService, Match } from '../../services/api';

const MatchDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMatch = async () => {
      if (!id) return;
      
      try {
        const response = await apiService.getMatch(id);
        if (response.success && response.data) {
          setMatch(response.data);
        } else {
          setError('Match not found');
        }
      } catch (err) {
        console.log('Using demo data due to API error:', err);
        // Use demo data when API fails
        const demoMatch: Match = {
          id: id,
          date: new Date().toISOString(),
          type: id === 'demo-1' ? 'FRIENDLY' : 'TOURNAMENT',
          status: id === 'demo-1' ? 'IN_PROGRESS' : 'COMPLETED',
          createdAt: new Date().toISOString(),
          players: [
            { id: '1', matchId: id, userId: '1', team: 1, position: 1, user: { id: '1', username: 'john', email: 'john@example.com', firstName: 'John', lastName: 'Doe' } },
            { id: '2', matchId: id, userId: '2', team: 1, position: 2, user: { id: '2', username: 'jane', email: 'jane@example.com', firstName: 'Jane', lastName: 'Smith' } },
            { id: '3', matchId: id, userId: '3', team: 2, position: 1, user: { id: '3', username: 'mike', email: 'mike@example.com', firstName: 'Mike', lastName: 'Wilson' } },
            { id: '4', matchId: id, userId: '4', team: 2, position: 2, user: { id: '4', username: 'sarah', email: 'sarah@example.com', firstName: 'Sarah', lastName: 'Jones' } }
          ],
          events: [],
          playerStats: []
        };
        setMatch(demoMatch);
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">{error || 'Match not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  {match.type} Match Details
                </h1>
                <Link
                  to="/matches"
                  className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                >
                  ← Back to Matches
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Match Information</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="text-sm text-gray-900">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            match.status === 'IN_PROGRESS'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {match.status}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Created</dt>
                      <dd className="text-sm text-gray-900">
                        {new Date(match.createdAt).toLocaleDateString()}
                      </dd>
                    </div>
                    {match.phase && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Phase</dt>
                        <dd className="text-sm text-gray-900">{match.phase}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Players</h3>
                  {match.players.length === 0 ? (
                    <p className="text-gray-500">No players assigned</p>
                  ) : (
                    <div className="space-y-2">
                      {match.players.map((player) => (
                        <div key={player.id} className="flex items-center justify-between">
                          <span className="text-sm text-gray-900">
                            {player.user.firstName} {player.user.lastName}
                          </span>
                          <span className="text-xs text-gray-500">
                            Team {player.team}, Position {player.position}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {match.status === 'IN_PROGRESS' && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Match Actions</h3>
                  <div className="flex space-x-4">
                    {user ? (
                      <>
                        <Link
                          to={`/matches/${match.id}/live`}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                        >
                          Start Live Match
                        </Link>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                          View Live Stats
                        </button>
                        <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
                          Complete Match
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                        >
                          Sign In to Start Live Match
                        </Link>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                          View Live Stats
                        </button>
                        <Link
                          to="/login"
                          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                        >
                          Sign In to Complete Match
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;
