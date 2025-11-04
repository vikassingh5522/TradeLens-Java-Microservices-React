export default function RiskMetrics({ risk }) {
  return (
    <div className="bg-white shadow-md p-4 rounded-lg w-72">
      <h3 className="font-semibold text-lg mb-2">Risk Overview</h3>
      {risk ? (
        <>
          <p><strong>Level:</strong> {risk.riskLevel}</p>
          <p><strong>Exposure:</strong> {(risk.exposure * 100).toFixed(2)}%</p>
        </>
      ) : (
        <p>Loading risk data...</p>
      )}
    </div>
  );
}
