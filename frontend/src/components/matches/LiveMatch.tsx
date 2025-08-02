import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService, Match, MatchPlayer } from '../../services/api';
import EventRecorder from './EventRecorder';

interface Player {
  id: string;
  name: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  team: number;
}

interface CourtPosition {
  top: string;
  left: string;
  team: number;
}

const LiveMatch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [match, setMatch] = useState<Match | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showEventRecorder, setShowEventRecorder] = useState(false);

  useEffect(() => {
    const fetchMatch = async () => {
      if (!id) return;
      
      try {
        const response = await apiService.getMatch(id);
        if (response.success && response.data) {
          setMatch(response.data);
          
          // Map players to court positions
          const courtPlayers: Player[] = response.data.players.map((player: MatchPlayer, index: number) => {
            const positions: ('top-left' | 'top-right' | 'bottom-left' | 'bottom-right')[] = [
              'top-left', 'top-right', 'bottom-left', 'bottom-right'
            ];
            return {
              id: player.userId,
              name: `${player.user.firstName} ${player.user.lastName}`,
              position: positions[index],
              team: player.team
            };
          });
          setPlayers(courtPlayers);
        } else {
          setError('Match not found');
        }
      } catch (err) {
        setError('Failed to load match');
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [id]);

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    setShowEventRecorder(true);
  };

  const handleEventRecorded = () => {
    // Refresh match data to show updated stats
    // You could add real-time updates here
    console.log('Event recorded, refreshing data...');
  };

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
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Live Match: {match.type}
              </h1>
              <p className="text-sm text-gray-600">
                Click on players to record events
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate(`/matches/${id}`)}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Back to Match Details
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Court Layout */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Court Layout</h2>
              
              {/* Padel Court */}
              <div className="relative bg-green-600 rounded-lg p-4" style={{ aspectRatio: '2/1' }}>
                {/* Court lines */}
                <div className="absolute inset-4 border-2 border-white rounded"></div>
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white transform -translate-y-1/2"></div>
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white transform -translate-x-1/2"></div>
                
                {/* Service boxes */}
                <div className="absolute top-4 left-4 right-1/2 h-8 border-r border-white"></div>
                <div className="absolute top-4 left-1/2 right-4 h-8 border-l border-white"></div>
                <div className="absolute bottom-4 left-4 right-1/2 h-8 border-r border-white"></div>
                <div className="absolute bottom-4 left-1/2 right-4 h-8 border-l border-white"></div>

                {/* Players */}
                {players.map((player) => (
                  <button
                    key={player.id}
                    onClick={() => handlePlayerClick(player)}
                    className={`absolute w-16 h-16 rounded-full border-4 border-white text-white font-bold text-sm flex items-center justify-center cursor-pointer hover:scale-110 transition-transform ${
                      player.team === 1 ? 'bg-blue-600' : 'bg-red-600'
                    }`}
                    style={{
                      top: player.position.includes('top') ? '8%' : '75%',
                      left: player.position.includes('left') ? '12%' : '75%',
                    }}
                    title={`${player.name} (Team ${player.team})`}
                  >
                    {player.name.split(' ').map(n => n[0]).join('')}
                  </button>
                ))}
              </div>

              {/* Court Legend */}
              <div className="mt-4 flex justify-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-600">Team 1</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                  <span className="text-sm text-gray-600">Team 2</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">0 - 0</div>
                  <div className="text-sm text-gray-600">Score</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">0</div>
                    <div className="text-xs text-gray-600">Team 1 Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-red-600">0</div>
                    <div className="text-xs text-gray-600">Team 2 Points</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Event Recorder */}
        {showEventRecorder && selectedPlayer && (
          <EventRecorder
            player={selectedPlayer}
            matchId={id!}
            onEventRecorded={handleEventRecorded}
            onClose={() => {
              setShowEventRecorder(false);
              setSelectedPlayer(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default LiveMatch;
