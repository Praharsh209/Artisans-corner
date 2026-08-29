import { createSlice } from '@reduxjs/toolkit';

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userInfo: userInfoFromStorage,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
      state.error = null;
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
      state.error = null;
    },
    updateUser: (state, action) => {
      state.userInfo = { ...state.userInfo, ...action.payload };
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setCredentials, logout, updateUser, setLoading, setError, clearError } =
  authSlice.actions;
export default authSlice.reducer;
