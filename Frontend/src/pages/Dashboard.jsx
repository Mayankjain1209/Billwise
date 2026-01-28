import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Upload,
  TrendingUp,
  FileText,
  IndianRupee,
  Zap,
  Activity,
  CreditCard,
} from 'lucide-react';

const Dashboard = () => {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [billType, setBillType] = useState('electricity');
  const [file, setFile] = useState(null);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [userInstruction, setUserInstruction] = useState('');

  /* ================= FETCH BILLS ================= */
  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await axios.get('/api/bills');
      setBills(res.data.bills || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPLOAD BILL ================= */
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !amount || !date) {
      alert('All fields are required');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', billType);
    formData.append('amount', amount);
    formData.append('date', date);
    formData.append('userInstruction', userInstruction);

    setUploading(true);
    setSelectedBill(null);

    try {
      const res = await axios.post('/api/bills/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setBills((prev) => [res.data.bill, ...prev]);
      setSelectedBill(res.data.bill);
      setFile(null);
      setAmount('');
      setUserInstruction('');
    } catch (err) {
      console.error(err);
      alert('Failed to upload bill');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const totalSpend = bills.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl border">
          <p className="text-3xl font-bold">₹{totalSpend}</p>
          <p className="text-slate-500">Total Spend</p>
        </div>
        <div className="bg-white p-6 rounded-xl border">
          <p className="text-3xl font-bold">₹{bills[0]?.amount || 0}</p>
          <p className="text-slate-500">Latest Bill</p>
        </div>
        <div className="bg-white p-6 rounded-xl border">
          <p className="text-3xl font-bold">{bills.length}</p>
          <p className="text-slate-500">Bills Uploaded</p>
        </div>
      </div>

      {/* UPLOAD FORM */}
      <div className="bg-white p-6 rounded-xl border mb-6">
        <h2 className="text-xl font-bold mb-4">Upload New Bill</h2>
        <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={billType}
            onChange={(e) => setBillType(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="electricity">Electricity</option>
            <option value="hospital">Hospital</option>
            <option value="credit_card">Credit Card</option>
            <option value="mobile_internet">Mobile / Internet</option>
          </select>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="border rounded-lg px-3 py-2"
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />

          <input
            type="text"
            placeholder="Special instructions (optional)"
            value={userInstruction}
            onChange={(e) => setUserInstruction(e.target.value)}
            className="border rounded-lg px-3 py-2 md:col-span-4"
          />

          <button
            disabled={uploading}
            className="bg-indigo-600 text-white rounded-lg py-2 md:col-span-4"
          >
            {uploading ? 'Analyzing...' : 'Upload Bill'}
          </button>
        </form>
      </div>

      {/* RECENT BILLS */}
      <div className="bg-white p-6 rounded-xl border">
        <h2 className="text-xl font-bold mb-4">Recent Bills</h2>
        {bills.map((bill) => (
          <div
            key={bill.id}
            className="flex justify-between items-center border p-4 rounded-lg mb-3"
          >
            <div className="flex items-center gap-3">
              {bill.type === 'electricity' ? (
                <Zap />
              ) : bill.type === 'hospital' ? (
                <Activity />
              ) : (
                <CreditCard />
              )}
              <div>
                <p className="font-bold capitalize">
                  {bill.type.replace('_', ' ')}
                </p>
                <p className="text-sm text-slate-500">
                  {new Date(bill.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <p className="font-bold">₹{bill.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;