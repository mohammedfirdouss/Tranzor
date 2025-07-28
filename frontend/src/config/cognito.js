import { CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';

// Cognito configuration
const cognitoConfig = {
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || 'mock-pool-id',
  ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID || 'mock-client-id',
  Region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
};

// Check if we're in mock mode
const isMockMode = import.meta.env.VITE_USE_MOCK_AUTH === 'true' || 
                   !import.meta.env.VITE_COGNITO_USER_POOL_ID || 
                   import.meta.env.VITE_COGNITO_USER_POOL_ID.includes('xxxxxxxxx');

// Create user pool instance
export const userPool = isMockMode ? null : new CognitoUserPool({
  UserPoolId: cognitoConfig.UserPoolId,
  ClientId: cognitoConfig.ClientId,
});

// Authentication helper functions
export const authHelpers = {
  // Get current user
  getCurrentUser: () => {
    if (isMockMode) return null;
    return userPool.getCurrentUser();
  },

  // Get current session
  getCurrentSession: async () => {
    if (isMockMode) return null;
    const user = userPool.getCurrentUser();
    if (user) {
      return new Promise((resolve, reject) => {
        user.getSession((err, session) => {
          if (err) {
            reject(err);
          } else {
            resolve(session);
          }
        });
      });
    }
    return null;
  },

  // Get access token
  getAccessToken: async () => {
    if (isMockMode) return localStorage.getItem('tranzor_mock_token');
    const session = await authHelpers.getCurrentSession();
    return session?.getAccessToken()?.getJwtToken();
  },

  // Get ID token
  getIdToken: async () => {
    if (isMockMode) return localStorage.getItem('tranzor_mock_id_token');
    const session = await authHelpers.getCurrentSession();
    return session?.getIdToken()?.getJwtToken();
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    if (isMockMode) {
      return !!localStorage.getItem('tranzor_mock_token');
    }
    try {
      const session = await authHelpers.getCurrentSession();
      return session?.isValid() || false;
    } catch {
      return false;
    }
  },

  // Sign out
  signOut: () => {
    if (isMockMode) {
      localStorage.removeItem('tranzor_mock_token');
      localStorage.removeItem('tranzor_mock_id_token');
      localStorage.removeItem('tranzor_auth_token');
      localStorage.removeItem('tranzor_user_info');
      return;
    }
    const user = userPool.getCurrentUser();
    if (user) {
      user.signOut();
    }
    localStorage.removeItem('tranzor_auth_token');
    localStorage.removeItem('tranzor_user_info');
  },

  // Sign up confirmation
  confirmSignUp: (email, code) => {
    if (isMockMode) {
      return Promise.resolve({ message: 'Mock confirmation successful' });
    }
    return new Promise((resolve, reject) => {
      const userData = {
        Username: email,
        Pool: userPool,
      };
      const cognitoUser = new CognitoUser(userData);
      cognitoUser.confirmRegistration(code, true, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  // Resend sign up code
  resendSignUpCode: (email) => {
    if (isMockMode) {
      return Promise.resolve({ message: 'Mock code resent' });
    }
    return new Promise((resolve, reject) => {
      const userData = {
        Username: email,
        Pool: userPool,
      };
      const cognitoUser = new CognitoUser(userData);
      cognitoUser.resendConfirmationCode((err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
};

export default cognitoConfig; 