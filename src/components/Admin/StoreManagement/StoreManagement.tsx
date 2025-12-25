import * as React from "react";
import { useNavigate } from "react-router-dom";

const StoreManagement: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section style={{ padding: 24 }}>
      <h2>Store Management</h2>
      <p>TODO: pull data from DB + CheapShark</p>
      <button type="button" onClick={() => navigate("/admin")}>
        Back to dashboard
      </button>
    </section>
  );
};

export default StoreManagement;

