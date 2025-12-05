import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  locals: [],
  isLoading: false,
  error: null
};

const localsSlice = createSlice({
  name: 'locals',
  initialState,
  reducers: {
    setLocals: (state, action) => {
      state.locals = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    }
  }
});

export const { setLocals, setLoading, setError } = localsSlice.actions;
export default localsSlice.reducer;