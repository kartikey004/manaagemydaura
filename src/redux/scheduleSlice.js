// import {createSlice} from '@reduxjs/toolkit';

// const scheduleSlice = createSlice({
//   name: 'schedule',
//   initialState: {
//     schedules: [], // [{ date: '08-04-25', slots: [ { time, message, location } ] }]
//   },
//   reducers: {
//     addSchedule: (state, action) => {
//       const {date, slots} = action.payload;

//       const existingIndex = state.schedules.findIndex(s => s.date === date);

//       if (existingIndex !== -1) {
//         state.schedules[existingIndex] = {date, slots};
//       } else {
//         state.schedules.push({date, slots});
//       }
//     },

//     removeSchedule: (state, action) => {
//       state.schedules = state.schedules.filter(s => s.date !== action.payload);
//     },
//   },
// });

// export const {addSchedule, removeSchedule} = scheduleSlice.actions;
// export default scheduleSlice.reducer;

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../api/api';

export const createSchedule = createAsyncThunk(
  'schedule/createSchedule',
  async ({date, slots}, {rejectWithValue}) => {
    try {
      const response = await api.post('/schedule/create', {date, slots});
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to schedule',
      );
    }
  },
);

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState: {
    schedules: [], // each schedule: { date, slots: [{time, message, location}] }
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearScheduleStatus: state => {
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(createSchedule.pending, state => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;

        const {date, slots} = action.meta.arg;

        const existingIndex = state.schedules.findIndex(s => s.date === date);

        if (existingIndex !== -1) {
          state.schedules[existingIndex] = {date, slots};
        } else {
          state.schedules.push({date, slots});
        }
      })
      .addCase(createSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error creating schedule';
      });
  },
});

export const {clearScheduleStatus} = scheduleSlice.actions;
export default scheduleSlice.reducer;
