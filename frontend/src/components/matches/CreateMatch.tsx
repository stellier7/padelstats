import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';

const CreateMatch: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: 'FRIENDLY' as 'TOURNAMENT' | 'FRIENDLY',
    phase: '',
    playerIds: ['cmdtk5rwz000035agxw1sd2gw', 'cmdtk5rx6000135agur1v26o6', 'cmdtk5rx6000235aga2ybjtg1', 'cmdtk5rx6000335agw10vncnr'] as string[],
    tournamentId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is authenticated
    const token = apiService.getAuthToken();
    console.log('CreateMatch - Auth token:', token ? 'Present' : 'Missing');
    if (!token) {
      setError('You must be logged in to create a match');
    } else {
      console.log('CreateMatch - Token length:', token.length);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Creating match with data:', formData);
      const response = await apiService.createMatch(formData);
      console.log('Match creation response:', response);
      
      if (response.success) {
        navigate('/matches');
      } else {
        setError(response.error || 'Failed to create match');
      }
    } catch (err: any) {
      console.error('Match creation error:', err);
      if (err.response?.data?.details) {
        setError(`Validation failed: ${err.response.data.details.join(', ')}`);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to create match');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Match</h1>
              
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Match Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'TOURNAMENT' | 'FRIENDLY' })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="FRIENDLY">Friendly Match</option>
                    <option value="TOURNAMENT">Tournament Match</option>
                  </select>
                </div>

                {formData.type === 'TOURNAMENT' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tournament Phase
                    </label>
                    <select
                      value={formData.phase}
                      onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select Phase</option>
                      <option value="OCTAVOS">Octavos</option>
                      <option value="CUARTOS">Cuartos</option>
                      <option value="SEMIFINAL">Semifinal</option>
                      <option value="FINAL">Final</option>
                    </select>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Players</h4>
                  <p className="text-sm text-blue-700">
                    This match will include 4 players: John Doe, Mike Wilson, Jane Smith, and Sarah Jones.
                  </p>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => navigate('/matches')}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create Match'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMatch;
