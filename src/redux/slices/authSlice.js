import { createSlice } from '@reduxjs/toolkit';

const SESSION_DURATION = 6 * 60 * 60 * 1000; // 6 horas en milisegundos

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('authState');
    if (serializedState === null) {
      return undefined;
    }
    const state = JSON.parse(serializedState);
    if (state.expirationTime && new Date().getTime() > state.expirationTime) {
      return undefined; // La sesión ha expirado
    }
    return state;
  } catch (err) {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('authState', serializedState);
  } catch {
    // Ignorar errores de escritura
  }
};

const initialState = loadState() || {
  isAuthenticated: false,
  accessToken: null,
  userData: null,
  role: null,
  subDomain: null,
  localId: null,
  businessName: null,
  expirationTime: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.accessToken = action.payload.accessToken;
      state.userData = {
        id: action.payload._id,
        name: action.payload.name,
        email: action.payload.email,
        phone: action.payload.phone,
      };
      state.role = action.payload.role;
      state.subDomain = action.payload.subDomain || null;
      state.localId = action.payload.localId || null;
      state.businessName = action.payload.businessName || null;
      state.expirationTime = new Date().getTime() + SESSION_DURATION;
      saveState(state);
    },
    logout: (state) => {
      Object.assign(state, {
        isAuthenticated: false,
        accessToken: null,
        userData: null,
        role: null,
        subDomain: null,
        localId: null,
        businessName: null,
        expirationTime: null,
      });
      localStorage.removeItem('authState');
    },
    checkSession: (state) => {
      if (state.expirationTime && new Date().getTime() > state.expirationTime) {
        Object.assign(state, {
          isAuthenticated: false,
          accessToken: null,
          userData: null,
          role: null,
          subDomain: null,
          localId: null,
          businessName: null,
          expirationTime: null,
        });
        localStorage.removeItem('authState');
      }
    },
  },
});

export const { login, logout, checkSession } = authSlice.actions;

export default authSlice.reducer;