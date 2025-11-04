import { useEffect, useState, useContext } from "react";
import { getHoldings } from "../api/portfolioApi";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../Components//Sidebar";
import PortfolioChart from "../components/PortfolioChart";

export default function Dashboard() {
  const [holdings, setHoldings] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (token) getHoldings(token).then((res) => setHoldings(res.data));
  }, [token]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-4">
          <h2 className="text-2xl font-semibold mb-4">Your Portfolio</h2>
          {holdings.length ? (
            <PortfolioChart holdings={holdings} />
          ) : (
            <p>No holdings yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
