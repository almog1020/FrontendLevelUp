import * as React from "react";
import { useNavigate } from "react-router-dom";

const ReviewModeration: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section style={{ padding: 24 }}>
      <h2>Review Moderation</h2>
      <p>TODO: pull data from DB</p>
      <button type="button" onClick={() => navigate("/admin")}>
        Back to dashboard
      </button>
    </section>
  );
};

export default ReviewModeration;

