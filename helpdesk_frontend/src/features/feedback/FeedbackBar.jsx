import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLike, setDislike, setStarRating } from "./feedbackSlice";

export default function FeedbackBar() {
  const dispatch = useDispatch();
  const { like, dislike, starRating } = useSelector((state) => state.feedback);

  const handleLike = () => {
    dispatch(setLike(!like));
    if (dislike) dispatch(setDislike(false));
  };

  const handleDislike = () => {
    dispatch(setDislike(!dislike));
    if (like) dispatch(setLike(false));
  };

  const handleStarClick = (rating) => {
    dispatch(setStarRating(rating));
  };

  return (
    <div className="feedback-bar">
      <div class="feedback-text">You can rate the helpdesk</div>

      <div className="feedback-group">
        <button
          className={`feedback-btn like-btn bordered ${like ? "active" : ""}`}
          onClick={handleLike}
          aria-label="Like"
        >
          👍
        </button>
        <button
          className={`feedback-btn dislike-btn bordered ${dislike ? "active" : ""}`}
          onClick={handleDislike}
          aria-label="Dislike"
        >
          👎
        </button>
        <div className="star-rating">
          {[1, 2, 3].map((star) => (
            <span
              key={star}
              className={`star bordered ${starRating >= star ? "filled" : ""}`}
              onClick={() => handleStarClick(star)}
              role="button"
              tabIndex={0}
              aria-label={`${star} star`}
            >
              ★
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
