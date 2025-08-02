import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';

interface DiagnosticResult {
  test: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  details?: any;
}

const NetworkDiagnostic: React.FC = () => {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    setResults([]);

    const newResults: DiagnosticResult[] = [];

    // Test 1: Environment Detection
    newResults.push({
      test: 'Environment Detection',
      status: 'pending',
      message: 'Checking environment...'
    });
    setResults([...newResults]);

    const isProduction = window.location.hostname !== 'localhost';
    newResults[0] = {
      test: 'Environment Detection',
      status: 'success',
      message: `Running in ${isProduction ? 'production' : 'development'} mode`,
      details: {
        hostname: window.location.hostname,
        protocol: window.location.protocol,
        port: window.location.port
      }
    };
    setResults([...newResults]);

    // Test 2: API URL Detection
    newResults.push({
      test: 'API URL Detection',
      status: 'pending',
      message: 'Detecting API URL...'
    });
    setResults([...newResults]);

    const apiUrl = isProduction 
      ? 'https://padelstats.onrender.com/api'
      : (process.env.REACT_APP_API_URL || 'http://localhost:3001/api');

    newResults[1] = {
      test: 'API URL Detection',
      status: 'success',
      message: `API URL: ${apiUrl}`,
      details: { apiUrl }
    };
    setResults([...newResults]);

    // Test 3: Backend Health Check
    newResults.push({
      test: 'Backend Health Check',
      status: 'pending',
      message: 'Checking backend health...'
    });
    setResults([...newResults]);

    try {
      const healthResponse = await apiService.healthCheck();
      newResults[2] = {
        test: 'Backend Health Check',
        status: 'success',
        message: 'Backend is healthy and responding',
        details: healthResponse
      };
    } catch (error: any) {
      newResults[2] = {
        test: 'Backend Health Check',
        status: 'error',
        message: `Backend health check failed: ${error.message}`,
        details: {
          error: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText
        }
      };
    }
    setResults([...newResults]);

    // Test 4: CORS Test
    newResults.push({
      test: 'CORS Configuration',
      status: 'pending',
      message: 'Testing CORS configuration...'
    });
    setResults([...newResults]);

    try {
      const response = await fetch(`${apiUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        newResults[3] = {
          test: 'CORS Configuration',
          status: 'success',
          message: 'CORS is properly configured',
          details: {
            status: response.status,
            headers: Object.fromEntries(response.headers.entries())
          }
        };
      } else {
        newResults[3] = {
          test: 'CORS Configuration',
          status: 'error',
          message: `CORS test failed with status: ${response.status}`,
          details: {
            status: response.status,
            statusText: response.statusText
          }
        };
      }
    } catch (error: any) {
      newResults[3] = {
        test: 'CORS Configuration',
        status: 'error',
        message: `CORS test failed: ${error.message}`,
        details: { error: error.message }
      };
    }
    setResults([...newResults]);

    // Test 5: Authentication Test
    newResults.push({
      test: 'Authentication System',
      status: 'pending',
      message: 'Testing authentication endpoints...'
    });
    setResults([...newResults]);

    try {
      const response = await fetch(`${apiUrl}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer invalid-token`
        },
      });
      
      if (response.status === 401) {
        newResults[4] = {
          test: 'Authentication System',
          status: 'success',
          message: 'Authentication system is working (correctly rejected invalid token)',
          details: { status: response.status }
        };
      } else {
        newResults[4] = {
          test: 'Authentication System',
          status: 'error',
          message: `Unexpected response for invalid token: ${response.status}`,
          details: { status: response.status }
        };
      }
    } catch (error: any) {
      newResults[4] = {
        test: 'Authentication System',
        status: 'error',
        message: `Authentication test failed: ${error.message}`,
        details: { error: error.message }
      };
    }
    setResults([...newResults]);

    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'pending': return '⏳';
      default: return '❓';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Network Diagnostic Tool</h2>
        <p className="text-gray-600">
          This tool helps diagnose network connectivity issues between your frontend and backend.
        </p>
      </div>

      <div className="mb-6">
        <button
          onClick={runDiagnostics}
          disabled={isRunning}
          className={`px-6 py-3 rounded-lg font-semibold ${
            isRunning
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white transition-colors`}
        >
          {isRunning ? 'Running Diagnostics...' : 'Run Network Diagnostics'}
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Diagnostic Results:</h3>
          
          {results.map((result, index) => (
            <div
              key={index}
              className={`p-4 border rounded-lg ${
                result.status === 'success' ? 'border-green-200 bg-green-50' :
                result.status === 'error' ? 'border-red-200 bg-red-50' :
                'border-yellow-200 bg-yellow-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">{result.test}</h4>
                <span className={`text-lg ${getStatusColor(result.status)}`}>
                  {getStatusIcon(result.status)}
                </span>
              </div>
              
              <p className={`mb-2 ${getStatusColor(result.status)}`}>
                {result.message}
              </p>
              
              {result.details && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                    View Details
                  </summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">Troubleshooting Tips:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• If CORS fails, check that your backend CORS configuration includes your frontend domain</li>
          <li>• If health check fails, verify your backend is running and accessible</li>
          <li>• If authentication fails, check your JWT configuration</li>
          <li>• Check browser console for additional error details</li>
        </ul>
      </div>
    </div>
  );
};

export default NetworkDiagnostic; 