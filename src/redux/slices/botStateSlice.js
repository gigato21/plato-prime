import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  botStates: {},
};

const botStateSlice = createSlice({
  name: 'botState',
  initialState,
  reducers: {
    updateBotState: (state, action) => {
      const { clientPhone, isEnabled } = action.payload;
      state.botStates[clientPhone] = isEnabled;
    },
    setBotStates: (state, action) => {
      state.botStates = action.payload;
    },
  },
});

export const { updateBotState, setBotStates } = botStateSlice.actions;
export default botStateSlice.reducer;