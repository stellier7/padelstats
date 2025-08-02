import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiService, Match } from '../../services/api';

const MatchesList: React.FC = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await apiService.getAllMatches();
        if (response.success && response.data) {
          setMatches(response.data);
        }
      } catch (err) {
        console.log('Using demo data due to API error:', err);
        // Use demo data when API fails
        setMatches([
          {
            id: 'demo-1',
            date: new Date().toISOString(),
            type: 'FRIENDLY',
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
            players: [
              { id: '1', matchId: 'demo-1', userId: '1', team: 1, position: 1, user: { id: '1', username: 'john', email: 'john@example.com', firstName: 'John', lastName: 'Doe' } },
              { id: '2', matchId: 'demo-1', userId: '2', team: 1, position: 2, user: { id: '2', username: 'jane', email: 'jane@example.com', firstName: 'Jane', lastName: 'Smith' } },
              { id: '3', matchId: 'demo-1', userId: '3', team: 2, position: 1, user: { id: '3', username: 'mike', email: 'mike@example.com', firstName: 'Mike', lastName: 'Wilson' } },
              { id: '4', matchId: 'demo-1', userId: '4', team: 2, position: 2, user: { id: '4', username: 'sarah', email: 'sarah@example.com', firstName: 'Sarah', lastName: 'Jones' } }
            ],
            events: [],
            playerStats: []
          },
          {
            id: 'demo-2',
            date: new Date(Date.now() - 86400000).toISOString(),
            type: 'TOURNAMENT',
            status: 'COMPLETED',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            players: [
              { id: '5', matchId: 'demo-2', userId: '1', team: 1, position: 1, user: { id: '1', username: 'john', email: 'john@example.com', firstName: 'John', lastName: 'Doe' } },
              { id: '6', matchId: 'demo-2', userId: '2', team: 1, position: 2, user: { id: '2', username: 'jane', email: 'jane@example.com', firstName: 'Jane', lastName: 'Smith' } },
              { id: '7', matchId: 'demo-2', userId: '3', team: 2, position: 1, user: { id: '3', username: 'mike', email: 'mike@example.com', firstName: 'Mike', lastName: 'Wilson' } },
              { id: '8', matchId: 'demo-2', userId: '4', team: 2, position: 2, user: { id: '4', username: 'sarah', email: 'sarah@example.com', firstName: 'Sarah', lastName: 'Jones' } }
            ],
            events: [],
            playerStats: []
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">All Matches</h1>
                {user ? (
                  <Link
                    to="/matches/new"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Create New Match
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Sign In to Create Match
                  </Link>
                )}
              </div>
              
              {matches.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No matches found. Create your first match to get started!
                </p>
              ) : (
                <div className="space-y-4">
                  {matches.map((match) => (
                    <div
                      key={match.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">
                            {match.type} Match
                          </h4>
                          <p className="text-sm text-gray-500">
                            Created: {new Date(match.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            Players: {match.players.length}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              match.status === 'IN_PROGRESS'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {match.status}
                          </span>
                          <Link
                            to={`/matches/${match.id}`}
                            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                          >
                            View Details →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchesList;
