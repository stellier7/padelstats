import React, { useState } from 'react';
import { apiService } from '../../services/api';

interface EventRecorderProps {
  player: {
    id: string;
    name: string;
    team: number;
  };
  matchId: string;
  onEventRecorded: () => void;
  onClose: () => void;
}

const EventRecorder: React.FC<EventRecorderProps> = ({
  player,
  matchId,
  onEventRecorded,
  onClose
}) => {
  const [eventType, setEventType] = useState<string>('');
  const [additionalData, setAdditionalData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleEventRecord = async () => {
    if (!eventType) return;

    setLoading(true);
    try {
      const response = await apiService.recordEvent({
        matchId,
        playerId: player.id,
        eventType,
        additionalData
      });

      if (response.success) {
        console.log('Event recorded successfully:', response.data);
        onEventRecorded();
        onClose();
      }
    } catch (err) {
      console.error('Failed to record event:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderEventOptions = () => {
    switch (eventType) {
      case 'POINT_WON':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How was the point won?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setAdditionalData({ ...additionalData, winType: 'WINNER' })}
                  className={`p-2 text-sm rounded border ${
                    additionalData.winType === 'WINNER' 
                      ? 'bg-green-100 border-green-500 text-green-700' 
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  Winner Shot
                </button>
                <button
                  onClick={() => setAdditionalData({ ...additionalData, winType: 'OPPONENT_ERROR' })}
                  className={`p-2 text-sm rounded border ${
                    additionalData.winType === 'OPPONENT_ERROR' 
                      ? 'bg-green-100 border-green-500 text-green-700' 
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  Opponent Error
                </button>
                <button
                  onClick={() => setAdditionalData({ ...additionalData, winType: 'EXIT_34' })}
                  className={`p-2 text-sm rounded border ${
                    additionalData.winType === 'EXIT_34' 
                      ? 'bg-green-100 border-green-500 text-green-700' 
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  Exit 3/4
                </button>
                <button
                  onClick={() => setAdditionalData({ ...additionalData, winType: 'RETURN_WIN' })}
                  className={`p-2 text-sm rounded border ${
                    additionalData.winType === 'RETURN_WIN' 
                      ? 'bg-green-100 border-green-500 text-green-700' 
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  Return Win
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Serve Type (if applicable)
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setAdditionalData({ ...additionalData, serveType: 'FIRST' })}
                  className={`px-3 py-1 text-sm rounded border ${
                    additionalData.serveType === 'FIRST' 
                      ? 'bg-blue-100 border-blue-500 text-blue-700' 
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  First Serve
                </button>
                <button
                  onClick={() => setAdditionalData({ ...additionalData, serveType: 'SECOND' })}
                  className={`px-3 py-1 text-sm rounded border ${
                    additionalData.serveType === 'SECOND' 
                      ? 'bg-blue-100 border-blue-500 text-blue-700' 
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  Second Serve
                </button>
              </div>
            </div>
          </div>
        );

      case 'POINT_LOST':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How was the point lost?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setAdditionalData({ ...additionalData, lossType: 'UNFORCED_ERROR' })}
                  className={`p-2 text-sm rounded border ${
                    additionalData.lossType === 'UNFORCED_ERROR' 
                      ? 'bg-red-100 border-red-500 text-red-700' 
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  Unforced Error
                </button>
                <button
                  onClick={() => setAdditionalData({ ...additionalData, lossType: 'FORCED_ERROR' })}
                  className={`p-2 text-sm rounded border ${
                    additionalData.lossType === 'FORCED_ERROR' 
                      ? 'bg-red-100 border-red-500 text-red-700' 
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  Forced Error
                </button>
                <button
                  onClick={() => setAdditionalData({ ...additionalData, lossType: 'NET_ERROR' })}
                  className={`p-2 text-sm rounded border ${
                    additionalData.lossType === 'NET_ERROR' 
                      ? 'bg-red-100 border-red-500 text-red-700' 
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  Net Error
                </button>
                <button
                  onClick={() => setAdditionalData({ ...additionalData, lossType: 'EXIT_34' })}
                  className={`p-2 text-sm rounded border ${
                    additionalData.lossType === 'EXIT_34' 
                      ? 'bg-red-100 border-red-500 text-red-700' 
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  Exit 3/4
                </button>
              </div>
            </div>
          </div>
        );

      case 'SERVE':
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Serve Result
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setAdditionalData({ ...additionalData, serveResult: 'IN' })}
                  className={`p-2 text-sm rounded border ${
                    additionalData.serveResult === 'IN' 
                      ? 'bg-green-100 border-green-500 text-green-700' 
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  Serve In
                </button>
                <button
                  onClick={() => setAdditionalData({ ...additionalData, serveResult: 'OUT' })}
                  className={`p-2 text-sm rounded border ${
                    additionalData.serveResult === 'OUT' 
                      ? 'bg-red-100 border-red-500 text-red-700' 
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  Serve Out
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Serve Type
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setAdditionalData({ ...additionalData, serveType: 'FIRST' })}
                  className={`px-3 py-1 text-sm rounded border ${
                    additionalData.serveType === 'FIRST' 
                      ? 'bg-blue-100 border-blue-500 text-blue-700' 
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  First Serve
                </button>
                <button
                  onClick={() => setAdditionalData({ ...additionalData, serveType: 'SECOND' })}
                  className={`px-3 py-1 text-sm rounded border ${
                    additionalData.serveType === 'SECOND' 
                      ? 'bg-blue-100 border-blue-500 text-blue-700' 
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  Second Serve
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Record Event for {player.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Event Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setEventType('POINT_WON')}
                className={`p-3 text-sm rounded border ${
                  eventType === 'POINT_WON' 
                    ? 'bg-green-100 border-green-500 text-green-700' 
                    : 'bg-gray-50 border-gray-300'
                }`}
              >
                Point Won
              </button>
              <button
                onClick={() => setEventType('POINT_LOST')}
                className={`p-3 text-sm rounded border ${
                  eventType === 'POINT_LOST' 
                    ? 'bg-red-100 border-red-500 text-red-700' 
                    : 'bg-gray-50 border-gray-300'
                }`}
              >
                Point Lost
              </button>
              <button
                onClick={() => setEventType('SERVE')}
                className={`p-3 text-sm rounded border ${
                  eventType === 'SERVE' 
                    ? 'bg-blue-100 border-blue-500 text-blue-700' 
                    : 'bg-gray-50 border-gray-300'
                }`}
              >
                Serve
              </button>
              <button
                onClick={() => setEventType('ERROR')}
                className={`p-3 text-sm rounded border ${
                  eventType === 'ERROR' 
                    ? 'bg-yellow-100 border-yellow-500 text-yellow-700' 
                    : 'bg-gray-50 border-gray-300'
                }`}
              >
                Error
              </button>
            </div>
          </div>

          {/* Event-specific options */}
          {eventType && renderEventOptions()}

          {/* Action buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleEventRecord}
              disabled={!eventType || loading}
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Recording...' : 'Record Event'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRecorder;
