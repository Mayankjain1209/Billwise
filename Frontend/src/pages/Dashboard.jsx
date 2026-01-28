import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
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
  const { api } = useAuth();
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
      const res = await api.get('/api/bills');
      setBills(res.data.bills || []);
    } catch (err) {
      console.error('Fetch bills error:', err);
      alert(err.response?.data?.error || 'Failed to fetch bills');
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

    // Validate file size
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only JPEG, PNG and PDF files are allowed');
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
      const res = await api.post('/api/bills/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setBills((prev) => [res.data.bill, ...prev]);
      setSelectedBill(res.data.bill);
      
      // Reset form
      setFile(null);
      setAmount('');
      setUserInstruction('');
      document.querySelector('input[type="file"]').value = '';
      
      alert('Bill uploaded successfully!');
    } catch (err) {
      console.error('Upload error:', err);
      alert(err.response?.data?.error || 'Failed to upload bill');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const totalSpend = bills.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-slate-900">Dashboard</h1>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-500 font-medium">Total Spend</p>
            <IndianRupee className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">₹{totalSpend.toLocaleString()}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-500 font-medium">Latest Bill</p>
            <FileText className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">₹{bills[0]?.amount?.toLocaleString() || 0}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-500 font-medium">Bills Uploaded</p>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{bills.length}</p>
        </div>
      </div>

      {/* UPLOAD FORM */}
      <div className="bg-white p-6 rounded-xl border shadow-sm mb-6">
        <h2 className="text-xl font-bold mb-4 text-slate-900">Upload New Bill</h2>
        <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={billType}
            onChange={(e) => setBillType(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          >
            <option value="electricity">Electricity</option>
            <option value="hospital">Hospital</option>
            <option value="credit_card">Credit Card</option>
            <option value="mobile_internet">Mobile / Internet</option>
          </select>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            accept=".pdf,.jpg,.jpeg,.png"
            required
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            min="0"
            step="0.01"
            required
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            required
          />

          <input
            type="text"
            placeholder="Special instructions (optional)"
            value={userInstruction}
            onChange={(e) => setUserInstruction(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 md:col-span-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />

          <button
            type="submit"
            disabled={uploading}
            className="bg-indigo-600 text-white rounded-lg py-3 md:col-span-4 font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Upload Bill
              </>
            )}
          </button>
        </form>
      </div>

      {/* RECENT BILLS */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-slate-900">Recent Bills</h2>
        {bills.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No bills uploaded yet</p>
            <p className="text-slate-400 text-sm mt-2">Upload your first bill to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bills.map((bill) => (
              <div
                key={bill.id}
                className="flex justify-between items-center border border-slate-200 p-4 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  {bill.type === 'electricity' ? (
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Zap className="text-yellow-600 w-5 h-5" />
                    </div>
                  ) : bill.type === 'hospital' ? (
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Activity className="text-red-600 w-5 h-5" />
                    </div>
                  ) : (
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CreditCard className="text-blue-600 w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <p className="font-bold capitalize text-slate-900">
                      {bill.type.replace('_', ' ')}
                    </p>
                    <p className="text-sm text-slate-500">
                      {new Date(bill.date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-lg text-slate-900">₹{bill.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;