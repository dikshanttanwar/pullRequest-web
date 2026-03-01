import { createSlice } from "@reduxjs/toolkit";

const pendingSlice = createSlice({
  name: "requestPending",
  initialState: null,
  reducers: {
    addPending: (state, action) => action.payload,
    // removePending: (state, action) => null,
  },
});

export const { addPending } = pendingSlice.actions;

export default pendingSlice.reducer;
