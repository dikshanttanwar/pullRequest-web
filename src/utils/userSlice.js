import { createSlice } from "@reduxjs/toolkit";

export const user = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    addUser: (state, action) => {
      return action.payload;
    },
    deleteUser: () => {
      return null;
    },
  },
});

export const { addUser, deleteUser } = user.actions;

export default user.reducer;
