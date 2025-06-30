import { CognitoUserPool } from 'amazon-cognito-identity-js';

// Cognito configuration
const cognitoConfig = {
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
  Region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
};

// Create user pool instance
export const userPool = new CognitoUserPool({
  UserPoolId: cognitoConfig.UserPoolId,
  ClientId: cognitoConfig.ClientId,
});

// Authentication helper functions
export const authHelpers = {
  // Get current user
  getCurrentUser: () => {
    return userPool.getCurrentUser();
  },

  // Get current session
  getCurrentSession: async () => {
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
    const session = await authHelpers.getCurrentSession();
    return session?.getAccessToken()?.getJwtToken();
  },

  // Get ID token
  getIdToken: async () => {
    const session = await authHelpers.getCurrentSession();
    return session?.getIdToken()?.getJwtToken();
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    try {
      const session = await authHelpers.getCurrentSession();
      return session?.isValid() || false;
    } catch {
      return false;
    }
  },

  // Sign out
  signOut: () => {
    const user = userPool.getCurrentUser();
    if (user) {
      user.signOut();
    }
    localStorage.removeItem('tranzor_auth_token');
    localStorage.removeItem('tranzor_user_info');
  },
};

export default cognitoConfig; 