import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const fetchChats = createAsyncThunk(
  'chats/fetchChats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/history/all-chats-grouped');
      if (!response.ok) throw new Error('Server Error');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const chatSlice = createSlice({
  name: 'chats',
  initialState: {
    chats: [],
    selectedChat: null,
    chatHistory: [],
    botEnabledChats: {},
    loading: false,
    error: null,
  },
  reducers: {
    // ... (otros reducers)
    addChat: (state, action) => {
      state.chats.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.map(chat => ({
          id: chat.lastMessage?._id || chat._id,
          name: chat.clientName || chat.clientPhone,
          lastMessage: chat.lastMessage?.content || 'No messages',
          time: chat.lastMessage ? new Date(chat.lastMessage.createdAt).toLocaleTimeString() : '',
          date: chat.lastMessage ? chat.lastMessage.createdAt : new Date().toISOString(), // Guardamos la fecha como string
          isNewCustomer: !chat.clientName,
          clientPhone: chat.clientPhone,
          chatbotNumber: chat.chatbotNumber,
        }));
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // ... (resto de los casos)
  },
});

export const { addChat } = chatSlice.actions;
export default chatSlice.reducer;
