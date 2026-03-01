import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "requestReceived",
  initialState: null,
  reducers: {
    addRequest: (state, action) => action.payload,
    removeRequest: (state, action) => {
      const newRequests = state.filter((user) => user._id !== action.payload);
      return newRequests;
    },
  },
});

export const { addRequest, removeRequest } = requestSlice.actions;

export default requestSlice.reducer;
