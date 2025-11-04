import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../Components/Sidebar";
import RiskMetrics from "../Components/RiskMetrics";
import axios from "axios";

export default function Insights() {
  const [risk, setRisk] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8080/analytics/risk/1").then((res) => setRisk(res.data));
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-6">
          <h2 className="text-2xl mb-4">Analytics & Risk Insights</h2>
          <RiskMetrics risk={risk} />
        </div>
      </div>
    </div>
  );
}
