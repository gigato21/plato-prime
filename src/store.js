import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './redux/slices/chatSlice';
import authReducer from './redux/slices/authSlice';
import botStateReducer from './redux/slices/botStateSlice';
import localsReducer from './redux/slices/localsSlice';

export const store = configureStore({
  reducer: {
    chats: chatReducer,
    auth: authReducer,
    botState: botStateReducer,
    locals: localsReducer,
  },
});

export default store;