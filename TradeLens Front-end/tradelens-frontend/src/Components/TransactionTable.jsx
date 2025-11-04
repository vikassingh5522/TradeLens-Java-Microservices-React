export default function TransactionTable({ transactions }) {
  return (
    <table className="border w-full mt-4">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-2">Symbol</th>
          <th className="p-2">Quantity</th>
          <th className="p-2">Price</th>
          <th className="p-2">Type</th>
          <th className="p-2">Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((t, idx) => (
          <tr key={idx} className="text-center border-t">
            <td>{t.symbol}</td>
            <td>{t.quantity}</td>
            <td>{t.price}</td>
            <td>{t.type}</td>
            <td>{new Date(t.timestamp).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
