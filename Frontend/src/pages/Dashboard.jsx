import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Upload,
  AlertTriangle,
  CheckCircle,
  Info,
  TrendingUp,
  FileText,
  IndianRupee,
  Zap,
  Activity,
  CreditCard
} from 'lucide-react';

import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [billType, setBillType] = useState('electricity');
  const [fileName, setFileName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [userInstruction, setUserInstruction] = useState('');

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await axios.get('/api/bills');
      setBills(res.data.bills || []);
      // Keep analysis hidden on refresh
      setSelectedBill(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!fileName || !amount || !date) return;

    setUploading(true);
    setSelectedBill(null); // Clear old view immediately

    try {
      const res = await axios.post('/api/bills/upload', {
        type: billType,
        fileName,
        amount,
        date,
        userInstruction
      });

      const newBills = [res.data.bill, ...bills];
      setBills(newBills);
      setSelectedBill(res.data.bill);
      setFileName('');
      setAmount('');
      setUserInstruction('');
    } catch {
      alert('Failed to upload bill');
    } finally {
      setUploading(false);
    }
  };

  // ✅ HELPER: Extracts text safely from any format (String or Object)
  const getSafeText = (item) => {
    if (!item) return null;
    if (typeof item === 'string') return item.trim();
    if (typeof item === 'object') return (item.message || item.name || item.text || "").trim();
    return null;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500 font-medium">Loading Dashboard...</div>;
  }

  const analysis = selectedBill?.metadata
    ? JSON.parse(selectedBill.metadata)
    : null;

  const totalSpend = bills.reduce((sum, b) => sum + b.amount, 0);

  /* Charts Data */
  const lineData = {
    labels: bills.slice().reverse().map(b => new Date(b.date).toLocaleDateString()),
    datasets: [{
      label: 'Bill Amount',
      data: bills.slice().reverse().map(b => b.amount),
      borderColor: '#4f46e5',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      tension: 0.4,
      pointBackgroundColor: '#fff',
      pointBorderWidth: 2,
    }]
  };

  const barData = {
    labels: ['Electricity', 'Hospital', 'Credit Card', 'Mobile'],
    datasets: [{
      label: 'Total Spend',
      data: [
        bills.filter(b => b.type === 'electricity').reduce((a, b) => a + b.amount, 0),
        bills.filter(b => b.type === 'hospital').reduce((a, b) => a + b.amount, 0),
        bills.filter(b => b.type === 'credit_card').reduce((a, b) => a + b.amount, 0),
        bills.filter(b => b.type === 'mobile_internet').reduce((a, b) => a + b.amount, 0)
      ],
      backgroundColor: ['#4f46e5', '#818cf8', '#c7d2fe', '#e0e7ff'],
      borderRadius: 4,
    }]
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>

        {/* SUMMARY ROW */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
            <div className="flex items-center gap-3 text-indigo-600 mb-2">
              <div className="p-2 bg-indigo-50 rounded-lg"><IndianRupee className="w-5 h-5" /></div>
              <h3 className="font-semibold text-slate-700">Total Spend</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">₹{totalSpend.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
            <div className="flex items-center gap-3 text-indigo-600 mb-2">
              <div className="p-2 bg-indigo-50 rounded-lg"><FileText className="w-5 h-5" /></div>
              <h3 className="font-semibold text-slate-700">Latest Bill</h3>
            </div>
            <div>
                <p className="text-sm text-slate-500 capitalize">{bills[0]?.type || "No Data"}</p>
                <p className="text-3xl font-bold text-slate-900">₹{bills[0]?.amount.toLocaleString() || 0}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
            <div className="flex items-center gap-3 text-indigo-600 mb-2">
              <div className="p-2 bg-indigo-50 rounded-lg"><TrendingUp className="w-5 h-5" /></div>
              <h3 className="font-semibold text-slate-700">Bills Uploaded</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">{bills.length}</p>
          </div>
        </div>

        {/* UPLOAD FORM */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
             <Upload className="w-5 h-5 text-indigo-600" /> Upload New Bill
          </h2>
          <form onSubmit={handleUpload} className="grid md:grid-cols-4 gap-5">
            <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Type</label>
                <select value={billType} onChange={e => setBillType(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2.5 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option value="electricity">Electricity</option>
                    <option value="hospital">Hospital</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="mobile_internet">Mobile</option>
                </select>
            </div>
            <div className="flex flex-col gap-1">
                 <label className="text-xs font-bold text-slate-500 uppercase">File</label>
                 <input type="file" onChange={e => setFileName(e.target.files[0]?.name)} className="border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 text-sm file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"/>
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Amount</label>
                <input type="number" placeholder="₹" value={amount} onChange={e => setAmount(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div className="md:col-span-4 flex flex-col gap-1">
                 <label className="text-xs font-bold text-slate-500 uppercase">Instruction (Optional)</label>
                 <textarea className="border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Explain like I'm 10 / Hindi" value={userInstruction} onChange={e => setUserInstruction(e.target.value)} rows="2"/>
            </div>
            <button className="md:col-span-4 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold transition-colors shadow-md hover:shadow-lg">
              {uploading ? 'Analyzing...' : 'Upload & Analyze Bill'}
            </button>
          </form>
        </div>

        {/* ANALYSIS REPORT (With Bullet Point Fix) */}
        {selectedBill && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold flex gap-2 items-center text-slate-900">
                    <Info className="text-indigo-500" /> Analysis Report
                </h2>
                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-semibold">
                    ID: {selectedBill.id}
                </span>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <p className="text-slate-700 leading-relaxed text-lg">
                  {analysis?.explanation ? analysis.explanation : "Analysis pending or unavailable for this bill."}
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Scam Alerts Section */}
                {analysis?.scamAlerts && analysis.scamAlerts.length > 0 && (
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-5">
                    <h3 className="font-bold text-rose-700 flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-5 h-5" /> Warnings & Alerts
                    </h3>
                    <ul className="list-disc ml-5 space-y-1 text-rose-800">
                        {analysis.scamAlerts.map((item, i) => {
                           const text = getSafeText(item);
                           return text ? <li key={i}>{text}</li> : null;
                        })}
                    </ul>
                </div>
                )}

                {/* Suggestions Section */}
                {analysis?.suggestions && analysis.suggestions.length > 0 && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
                    <h3 className="font-bold text-emerald-700 flex items-center gap-2 mb-3">
                        <CheckCircle className="w-5 h-5" /> Suggestions
                    </h3>
                    <ul className="list-disc ml-5 space-y-1 text-emerald-800">
                        {analysis.suggestions.map((item, i) => {
                           const text = getSafeText(item); // ✅ FIXED: Uses helper to check for empty/missing text
                           return text ? <li key={i}>{text}</li> : null;
                        })}
                    </ul>
                </div>
                )}
            </div>

            {/* Optional Charges Section */}
            {analysis?.optionalCharges && analysis.optionalCharges.length > 0 && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
                <h3 className="font-bold text-amber-700 mb-3">Optional Charges Found</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.optionalCharges.map((item, i) => {
                      const text = getSafeText(item);
                      return text ? (
                        <span key={i} className="px-3 py-1 bg-white text-amber-800 border border-amber-200 rounded-full text-sm font-medium">
                            {text}
                        </span>
                      ) : null;
                  })}
                </div>
              </div>
            )}
            
            <div className="flex justify-end pt-4">
                <div className="text-2xl font-bold text-slate-900">
                    Total: <span className="text-indigo-600">₹{selectedBill.amount}</span>
                </div>
            </div>
          </div>
        )}

        {/* CHARTS */}
        {bills.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-900 mb-4">Spending Trend</h3>
                <div className="h-64"><Line data={lineData} options={{ maintainAspectRatio: false }} /></div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-900 mb-4">Category Comparison</h3>
                <div className="h-64"><Bar data={barData} options={{ maintainAspectRatio: false }} /></div>
            </div>
            </div>
        ) : (
            <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl p-12 text-center text-slate-500">
                <TrendingUp className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                <p>Upload your first bill to see analytics charts.</p>
            </div>
        )}

        {/* RECENT BILLS LIST */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Bills</h2>
          <div className="space-y-3">
            {bills.map(bill => (
              <div key={bill.id} onClick={() => setSelectedBill(bill)} className={`flex justify-between items-center p-4 border rounded-xl cursor-pointer transition-all ${selectedBill?.id === bill.id ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'}`}>
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${bill.type === 'electricity' ? 'bg-amber-100 text-amber-600' : bill.type === 'hospital' ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'}`}>
                        {bill.type === 'electricity' ? <Zap className="w-5 h-5"/> : bill.type === 'hospital' ? <Activity className="w-5 h-5"/> : <CreditCard className="w-5 h-5"/>}
                    </div>
                    <div>
                        <div className="font-bold text-slate-900 capitalize">{bill.type.replace('_', ' ')}</div>
                        <div className="text-sm text-slate-500">{new Date(bill.date).toLocaleDateString()}</div>
                    </div>
                </div>
                <div className="font-bold text-lg text-slate-700">₹{bill.amount}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;