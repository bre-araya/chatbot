import { combineReducers } from "@reduxjs/toolkit";
import chatReducer from "../features/chat/chatSlice";
import feedbackReducer from "../features/feedback/feedbackSlice";
import adminReducer from "../features/admin/adminSlice";
import accountReducer from "../features/auth/accountSlice";

const rootReducer = combineReducers({
  chat: chatReducer,
  feedback: feedbackReducer,
  admin: adminReducer,
  account: accountReducer,
});

export default rootReducer;

