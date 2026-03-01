import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import feedUser from "./feedSlice";
import connectionSlice from "./connectionSlice";
import requestSlice from "./requestSlice";
import pendingSlice from "./pendingSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedUser,
    connections: connectionSlice,
    requestReceived: requestSlice,
    requestPending: pendingSlice,
  },
});

export default appStore;
