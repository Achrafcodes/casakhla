import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signOutUser,
  getCurrentUserData
} from '../lib/authService';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: true,
  error: null,
};

// Async thunks for Firebase authentication
export const loginWithEmail = createAsyncThunk(
  'auth/loginWithEmail',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { user, userData } = await signInWithEmail(email, password);
      return {
        id: user.uid,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        isAdmin: userData.isAdmin,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signupWithEmail = createAsyncThunk(
  'auth/signupWithEmail',
  async (
    { email, password, firstName, lastName, phoneNumber }:
      { email: string; password: string; firstName: string; lastName: string; phoneNumber?: string },
    { rejectWithValue }
  ) => {
    try {
      const { user, userData } = await signUpWithEmail(email, password, firstName, lastName, phoneNumber);
      return {
        id: user.uid,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        isAdmin: userData.isAdmin,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      const { user, userData } = await signInWithGoogle();
      return {
        id: user.uid,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        isAdmin: userData.isAdmin,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await signOutUser();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkAuthState = createAsyncThunk<
  { id: string; email: string; firstName?: string; lastName?: string; phoneNumber?: string; isAdmin: boolean } | null
>(
  'auth/checkAuthState',
  async (_, { rejectWithValue }) => {
    try {
      return await new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          unsubscribe();
          if (user) {
            const userData = await getCurrentUserData(user.uid);
            if (userData) {
              resolve({
                id: user.uid,
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                phoneNumber: userData.phoneNumber,
                isAdmin: userData.isAdmin,
              });
            } else {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        }, reject);
      });
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login with email
    builder
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          id: action.payload.id,
          email: action.payload.email,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          phoneNumber: action.payload.phoneNumber,
        };
        state.isAuthenticated = true;
        state.isAdmin = action.payload.isAdmin;
        state.error = null;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Signup with email
    builder
      .addCase(signupWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          id: action.payload.id,
          email: action.payload.email,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          phoneNumber: action.payload.phoneNumber,
        };
        state.isAuthenticated = true;
        state.isAdmin = action.payload.isAdmin;
        state.error = null;
      })
      .addCase(signupWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Login with Google
    builder
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          id: action.payload.id,
          email: action.payload.email,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          phoneNumber: action.payload.phoneNumber,
        };
        state.isAuthenticated = true;
        state.isAdmin = action.payload.isAdmin;
        state.error = null;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isAdmin = false;
        state.error = null;
      });

    // Check auth state
    builder
      .addCase(checkAuthState.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthState.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.user = {
            id: action.payload.id,
            email: action.payload.email,
            firstName: action.payload.firstName,
            lastName: action.payload.lastName,
            phoneNumber: action.payload.phoneNumber,
          };
          state.isAuthenticated = true;
          state.isAdmin = action.payload.isAdmin;
        } else {
          state.user = null;
          state.isAuthenticated = false;
          state.isAdmin = false;
        }
      })
      .addCase(checkAuthState.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isAdmin = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;