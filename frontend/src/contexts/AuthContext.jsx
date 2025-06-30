import React, { createContext, useContext, useState, useEffect } from 'react';
import { message } from 'antd';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { userPool, authHelpers } from '../config/cognito';
import { useDispatch } from 'react-redux';
import { setCredentials, logout } from '../store/authSlice';

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
  const dispatch = useDispatch();

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
            
            // Also update Redux store
            dispatch(setCredentials({
              user: userInfo,
              token: accessToken
            }));
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
  }, [dispatch]);

  // Sign in function
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      return new Promise((resolve, reject) => {
        const cognitoUser = new CognitoUser({
          Username: email.trim().toLowerCase(),
          Pool: userPool,
        });
        const authDetails = new AuthenticationDetails({
          Username: email.trim().toLowerCase(),
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
              
              // Also update Redux store
              dispatch(setCredentials({
                user: userInfo,
                token: accessToken
              }));
              
              message.success('Successfully signed in!');
              resolve(userInfo);
            } catch (error) {
              reject(error);
            }
          },
          onFailure: (err) => {
            console.error('Sign in error:', err);
            let errorMessage = 'Sign in failed';
            
            // Provide more specific error messages
            if (err.code === 'UserNotFoundException') {
              errorMessage = 'User does not exist. Please register first.';
            } else if (err.code === 'NotAuthorizedException') {
              errorMessage = 'Incorrect email or password.';
            } else if (err.code === 'UserNotConfirmedException') {
              errorMessage = 'Please confirm your email address before signing in.';
            } else if (err.message) {
              errorMessage = err.message;
            }
            
            message.error(errorMessage);
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
      
      // Also clear Redux store
      dispatch(logout());
      
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