import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white group-hover:bg-indigo-500 transition-colors">
                B
              </div>
              <span className="text-xl font-bold tracking-tight">BillWise</span>
            </Link>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed mb-6">
              Empowering individuals and businesses to understand their finances, detect fraud, and optimize spending through advanced AI analysis.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-slate-900 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 bg-slate-900 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                <Linkedin size={18} />
              </a>
              <a href="#" className="p-2 bg-slate-900 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 bg-slate-900 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-slate-500">Product</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/dashboard" className="hover:text-indigo-400 transition-colors">Dashboard</Link></li>
              <li><Link to="/expenses" className="hover:text-indigo-400 transition-colors">Expense Tracking</Link></li>
              <li><Link to="/chat" className="hover:text-indigo-400 transition-colors">AI Assistant</Link></li>
              <li><Link to="#" className="hover:text-indigo-400 transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-slate-500">Resources</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/learn" className="hover:text-indigo-400 transition-colors">BillWise Academy</Link></li>
              <li><Link to="#" className="hover:text-indigo-400 transition-colors">Help Center</Link></li>
              <li><Link to="#" className="hover:text-indigo-400 transition-colors">Security</Link></li>
              <li><Link to="#" className="hover:text-indigo-400 transition-colors">Contact Support</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs">
            © 2026 BillWise.com. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-slate-500">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-white transition-colors">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;