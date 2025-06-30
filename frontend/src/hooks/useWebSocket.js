import { useState, useEffect, useRef, useCallback } from 'react';
import { message } from 'antd';

const WS_BASE_URL = import.meta.env.VITE_WEBSOCKET_URL || 'wss://localhost:3001';

export const useWebSocket = (endpoint, options = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = options.maxReconnectAttempts || 5;
  const reconnectInterval = options.reconnectInterval || 3000;

  const connect = useCallback(() => {
    // Disable WebSocket connections if not properly configured
    if (!import.meta.env.VITE_WEBSOCKET_URL || import.meta.env.VITE_WEBSOCKET_URL === 'wss://localhost:3001') {
      console.log('WebSocket disabled - not configured for production');
      setError('WebSocket not available');
      return;
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const url = `${WS_BASE_URL}${endpoint}`;
      const ws = new WebSocket(url);
      
      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;
        console.log(`WebSocket connected to ${endpoint}`);
        
        if (options.onConnect) {
          options.onConnect();
        }
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (options.onMessage) {
            options.onMessage(message);
          } else {
            // Default behavior: append to data array
            setData(prevData => {
              const newData = [message, ...prevData];
              // Keep only the latest 1000 items to prevent memory issues
              return newData.slice(0, 1000);
            });
          }
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('WebSocket connection error');
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        console.log(`WebSocket disconnected from ${endpoint}:`, event.code, event.reason);
        
        if (options.onDisconnect) {
          options.onDisconnect(event);
        }

        // Attempt to reconnect if not a normal closure
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current += 1;
          console.log(`Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts})...`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        } else if (reconnectAttempts.current >= maxReconnectAttempts) {
          setError('Failed to reconnect after maximum attempts');
          message.error('Real-time connection lost. Please refresh the page.');
        }
      };

      wsRef.current = ws;
    } catch (err) {
      console.error('Failed to create WebSocket connection:', err);
      setError('Failed to establish WebSocket connection');
    }
  }, [endpoint, options, maxReconnectAttempts, reconnectInterval]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect');
      wsRef.current = null;
    }
    
    setIsConnected(false);
  }, []);

  const sendMessage = useCallback((message) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    data,
    error,
    sendMessage,
    connect,
    disconnect,
  };
};

export default useWebSocket;