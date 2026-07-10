import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  like: false,
  dislike: false,
  starRating: 0,
};

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    setLike: (state, action) => {
      state.like = action.payload;
    },
    setDislike: (state, action) => {
      state.dislike = action.payload;
    },
    setStarRating: (state, action) => {
      state.starRating = action.payload;
    },
    resetFeedback: (state) => {
      state.like = false;
      state.dislike = false;
      state.starRating = 0;
    },
  },
});

export const { setLike, setDislike, setStarRating, resetFeedback } = feedbackSlice.actions;
export default feedbackSlice.reducer;
