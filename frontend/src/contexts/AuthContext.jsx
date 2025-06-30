import React, { createContext, useContext, useState, useEffect } from 'react';
import { message } from 'antd';
import { authHelpers } from '../config/cognito';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const authenticated = await authHelpers.isAuthenticated();
        setIsAuthenticated(authenticated);
        
        if (authenticated) {
          const currentUser = authHelpers.getCurrentUser();
          const accessToken = await authHelpers.getAccessToken();
          const idToken = await authHelpers.getIdToken();
          
          // Store tokens
          localStorage.setItem('tranzor_auth_token', accessToken);
          
          // Get user info from ID token
          if (idToken) {
            const payload = JSON.parse(atob(idToken.split('.')[1]));
            const userInfo = {
              username: payload['cognito:username'] || payload.sub,
              email: payload.email,
              name: payload.name || payload['cognito:username'],
              groups: payload['cognito:groups'] || [],
              sub: payload.sub,
            };
            
            setUser(userInfo);
            localStorage.setItem('tranzor_user_info', JSON.stringify(userInfo));
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear any stale data
        authHelpers.signOut();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Sign in function
  const signIn = async (username, password) => {
    try {
      setLoading(true);
      
      return new Promise((resolve, reject) => {
        const { CognitoUser, AuthenticationDetails } = require('amazon-cognito-identity-js');
        
        const cognitoUser = new CognitoUser({
          Username: username,
          Pool: require('../config/cognito').userPool,
        });

        const authDetails = new AuthenticationDetails({
          Username: username,
          Password: password,
        });

        cognitoUser.authenticateUser(authDetails, {
          onSuccess: async (result) => {
            try {
              const accessToken = result.getAccessToken().getJwtToken();
              const idToken = result.getIdToken().getJwtToken();
              
              // Store tokens
              localStorage.setItem('tranzor_auth_token', accessToken);
              
              // Get user info
              const payload = JSON.parse(atob(idToken.split('.')[1]));
              const userInfo = {
                username: payload['cognito:username'] || payload.sub,
                email: payload.email,
                name: payload.name || payload['cognito:username'],
                groups: payload['cognito:groups'] || [],
                sub: payload.sub,
              };
              
              setUser(userInfo);
              setIsAuthenticated(true);
              localStorage.setItem('tranzor_user_info', JSON.stringify(userInfo));
              
              message.success('Successfully signed in!');
              resolve(userInfo);
            } catch (error) {
              reject(error);
            }
          },
          onFailure: (err) => {
            console.error('Sign in error:', err);
            message.error(err.message || 'Sign in failed');
            reject(err);
          },
        });
      });
    } catch (error) {
      console.error('Sign in error:', error);
      message.error('Sign in failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = () => {
    try {
      authHelpers.signOut();
      setUser(null);
      setIsAuthenticated(false);
      message.success('Successfully signed out!');
    } catch (error) {
      console.error('Sign out error:', error);
      message.error('Sign out failed');
    }
  };

  // Check if user has specific permission/group
  const hasPermission = (permission) => {
    if (!user || !user.groups) return false;
    return user.groups.includes(permission);
  };

  // Check if user is admin
  const isAdmin = () => {
    return hasPermission('admin') || hasPermission('Admin');
  };

  // Confirm sign up
  const confirmSignUp = async (email, code) => {
    return authHelpers.confirmSignUp(email, code);
  };

  // Resend sign up code
  const resendSignUpCode = async (email) => {
    return authHelpers.resendSignUpCode(email);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    signIn,
    signOut,
    hasPermission,
    isAdmin,
    confirmSignUp,
    resendSignUpCode,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 