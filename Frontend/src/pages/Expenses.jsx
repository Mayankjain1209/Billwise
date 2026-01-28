import { useState, useEffect } from 'react';
import { TrendingUp, Filter, Download, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Expenses = () => {
  const { api } = useAuth();
  const [summary, setSummary] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [period, setPeriod] = useState('monthly');

  useEffect(() => {
    fetchExpenses();
  }, [filter, period]);

  const fetchExpenses = async () => {
    try {
      const [summaryRes, expensesRes] = await Promise.all([
        api.get('/api/expenses/summary', {
          params: { 
            period,
            type: filter !== 'all' ? filter : undefined 
          }
        }),
        api.get('/api/expenses', {
          params: { type: filter !== 'all' ? filter : undefined, limit: 100 }
        })
      ]);

      setSummary(summaryRes.data);
      setExpenses(expensesRes.data.expenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading expenses...</p>
        </div>
      </div>
    );
  }

  // Chart data
  const monthlyData = summary?.byMonth ? {
    labels: Object.keys(summary.byMonth).sort(),
    datasets: [
      {
        label: 'Total Expenses',
        data: Object.keys(summary.byMonth).sort().map(key => summary.byMonth[key]),
        borderColor: '#5850ec',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  } : null;

  const typeData = summary?.byType ? {
    labels: Object.keys(summary.byType).map(key => 
      key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
    ),
    datasets: [
      {
        data: Object.values(summary.byType),
        backgroundColor: ['#4941f0', '#7380f7', '#5052eb', '#a5b4fc', '#b7c4f7'],
        borderWidth: 0,
      },
    ],
  } : null;

  return (
    <div className="min-h-screen py-8 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-900">Expenses</h1>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2">
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">Total Expenses</p>
              <p className="text-4xl font-bold text-slate-900">₹{summary.summary.total.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">Total Bills</p>
              <p className="text-4xl font-bold text-slate-900">{summary.summary.count}</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">Average / Bill</p>
              <p className="text-4xl font-bold text-slate-900">₹{summary.summary.average.toFixed(0)}</p>
            </div>
          </div>
        )}

        {/* Filters & Controls */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-slate-600">
              <Filter className="w-4 h-4" />
              <span className="font-semibold text-sm">Filter:</span>
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
            >
              <option value="all">All Categories</option>
              <option value="electricity">Electricity</option>
              <option value="hospital">Hospital</option>
              <option value="credit_card">Credit Card</option>
              <option value="mobile_internet">Mobile/Internet</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-2 gap-6">
          {monthlyData && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-6 text-slate-900 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
                Expenses Over Time
              </h2>
              <Line data={monthlyData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
            </div>
          )}

          {typeData && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-6 text-slate-900">By Category</h2>
              <div className="h-64 flex justify-center">
                <Doughnut data={typeData} options={{ responsive: true, cutout: '70%' }} />
              </div>
            </div>
          )}
        </div>

        {/* Expenses List Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">
              Detailed Transaction History
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                  <th className="text-right py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.length > 0 ? (
                  expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 text-sm text-slate-600">
                        {new Date(expense.date).toLocaleDateString('en-IN')}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 capitalize">
                          {expense.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-900 font-medium">
                        {expense.description || expense.bill?.fileName || '-'}
                      </td>
                      <td className="py-4 px-6 text-right text-sm font-bold text-slate-900">
                        ₹{expense.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-slate-400">
                      No expenses found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;