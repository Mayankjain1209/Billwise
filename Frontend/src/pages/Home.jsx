import { Link } from 'react-router-dom';
import { 
  Upload, Shield, TrendingUp, MessageCircle, ArrowRight, 
  Zap, PieChart, Activity, Check, ChevronRight 
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Home = () => {
  const { t, language } = useLanguage();

  const features = [
    {
      icon: <Upload className="w-6 h-6 text-indigo-600" />,
      title: language === 'hi' ? 'AI बिल विश्लेषण' : 'AI Bill Analysis',
      description: language === 'hi' 
        ? 'अपने बिलों को अपलोड करें और सरल, मानव-पठनीय स्पष्टीकरण प्राप्त करें।'
        : 'Upload your bills and get simple, human-readable explanations.'
    },
    {
      icon: <Shield className="w-6 h-6 text-rose-600" />,
      title: language === 'hi' ? 'धोखाधड़ी का पता लगाना' : 'Scam Detection',
      description: language === 'hi'
        ? 'संदिग्ध शुल्कों और ओवरबिलिंग की पहचान करें।'
        : 'Identify suspicious charges and overbilling.'
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-emerald-600" />,
      title: language === 'hi' ? 'खर्च ट्रैकिंग' : 'Expense Tracking',
      description: language === 'hi'
        ? 'विज़ुअल एनालिटिक्स और महीने-दर-महीने तुलना के साथ खर्चों को ट्रैक करें।'
        : 'Track expenses with visual analytics and month-to-month comparisons.'
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-blue-600" />,
      title: language === 'hi' ? 'AI चैट' : 'AI Chat',
      description: language === 'hi'
        ? 'अपने बिलों के बारे में प्रश्न पूछें और तत्काल उत्तर प्राप्त करें।'
        : 'Ask questions about your bills and get instant answers.'
    }
  ];

  const steps = [
    {
      number: '01',
      title: language === 'hi' ? 'बिल अपलोड करें' : 'Upload Bill',
      description: language === 'hi'
        ? 'अपना बिल PDF या छवि के रूप में अपलोड करें'
        : 'Upload your bill as PDF or image'
    },
    {
      number: '02',
      title: language === 'hi' ? 'AI विश्लेषण' : 'AI Analysis',
      description: language === 'hi'
        ? 'हमारा AI आपके बिल को सरल भाषा में समझाता है'
        : 'Our AI explains your bill in simple language'
    },
    {
      number: '03',
      title: language === 'hi' ? 'अंतर्दृष्टि और चार्ट' : 'Insights & Charts',
      description: language === 'hi'
        ? 'विज़ुअल एनालिटिक्स और महीने-दर-महीने तुलना देखें'
        : 'View visual analytics and month-to-month comparisons'
    },
    {
      number: '04',
      title: language === 'hi' ? 'खर्च ट्रैकिंग' : 'Expense Tracking',
      description: language === 'hi'
        ? 'अपने सभी बिलों को एक जगह ट्रैक करें'
        : 'Track all your bills in one place'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-screen flex items-center pt-20 pb-20 overflow-hidden bg-slate-900 text-white">
        
        {/* Background Gradients */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen opacity-60"></div>
            <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] opacity-40"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center z-10 w-full">
          
          {/* Left Column: Text */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 text-indigo-300 mb-6 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-indigo-400 mr-2 animate-pulse"></span>
              <span className="text-xs font-bold tracking-wide uppercase">
                {language === 'hi' ? 'नया: AI विश्लेषण' : 'New: Smart AI Analysis'}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
              {language === 'hi' 
                ? <>बिलों को <span className="text-indigo-400">मानव की तरह</span> समझें।</>
                : <>Bills explained like a <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">human</span>, not a lawyer.</>}
            </h1>
            
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {language === 'hi'
                ? 'जटिल बिलों को सरल बनाएं। धोखाधड़ी रोकें और पैसे बचाएं।'
                : 'Stop overpaying. We decode complex bills, detect hidden fees, and help you track every penny using advanced AI.'}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white rounded-xl text-lg font-bold hover:bg-indigo-500 transition-all duration-200 shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] hover:-translate-y-1"
              >
                {language === 'hi' ? 'विश्लेषण शुरू करें' : 'Analyze My Bill'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link to="/learn" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white/5 text-white rounded-xl text-lg font-semibold hover:bg-white/10 border border-white/10 transition-colors backdrop-blur-sm">
                {language === 'hi' ? 'और जानें' : 'Learn More'}
              </Link>
            </div>
          </div>

          {/* Right Column: Dynamic UI Mockup */}
          <div className="relative hidden lg:block">
             <div className="relative bg-slate-900/80 border border-white/10 rounded-2xl shadow-2xl p-6 backdrop-blur-xl transform rotate-2 hover:rotate-0 transition-transform duration-700 ease-out">
                {/* Mockup Content */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                                <Zap size={20} fill="white" />
                             </div>
                             <div>
                                 <div className="h-2 w-24 bg-slate-700 rounded mb-1.5"></div>
                                 <div className="h-2 w-16 bg-slate-800 rounded"></div>
                             </div>
                        </div>
                        <div className="text-right">
                             <div className="text-xl font-bold text-white">₹1,240</div>
                             <div className="text-xs text-slate-400">Electricity Bill</div>
                        </div>
                    </div>
                    
                    {/* Simulated Graph */}
                    <div className="h-32 flex items-end justify-between gap-2 px-2 pt-4 border-t border-white/5">
                        {[40, 65, 45, 90, 55, 70].map((h, i) => (
                            <div key={i} className="w-full bg-indigo-500/20 rounded-t hover:bg-indigo-500 transition-colors" style={{height: `${h}%`}}></div>
                        ))}
                    </div>

                    <div className="p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                        <div className="text-xs text-indigo-300 font-semibold mb-1">AI Insight</div>
                        <div className="text-xs text-slate-300">Your usage is 15% lower than last month. Good job!</div>
                    </div>
                </div>
             </div>
             <div className="absolute -z-10 top-6 -right-6 w-full h-full bg-indigo-600 rounded-2xl opacity-20 transform rotate-6"></div>
          </div>

        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="py-24 px-4 max-w-7xl mx-auto relative z-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="mb-6 inline-block p-4 bg-indigo-50 rounded-xl group-hover:bg-indigo-600 transition-colors duration-300">
                <div className="group-hover:text-white transition-colors duration-300">
                    {feature.icon}
                </div>
              </div>
              <h3 className="text-lg font-bold mb-3 text-slate-900">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">Simple Process</span>
            <h2 className="text-3xl font-bold text-slate-900 mt-2">
              {language === 'hi' ? 'यह कैसे काम करता है' : 'How It Works'}
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-slate-100 -z-0"></div>
            {steps.map((step, index) => (
              <div key={index} className="relative z-10 text-center bg-white pt-4">
                <div className="w-16 h-16 bg-white border-2 border-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-xl font-bold mb-6 mx-auto shadow-sm">
                  {step.number}
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-900">{step.title}</h3>
                <p className="text-slate-500 text-sm px-4">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= USE CASES ================= */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
                 <h2 className="text-3xl font-bold text-slate-900 mb-2">
                    {language === 'hi' ? 'यह किसके लिए है?' : "Who is BillWise for?"}
                </h2>
                <p className="text-slate-500">Tailored solutions for every financial need.</p>
            </div>
            <Link to="/register" className="hidden md:flex items-center text-indigo-600 font-semibold hover:text-indigo-700">
                Get Started <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8 text-amber-500" />,
                title: language === 'hi' ? 'छात्र' : 'Students',
                description: language === 'hi' ? 'बजट बनाएं' : 'Track shared expenses and split bills easily.'
              },
              {
                icon: <Activity className="w-8 h-8 text-emerald-500" />,
                title: language === 'hi' ? 'फ्रीलांसर' : 'Freelancers',
                description: language === 'hi' ? 'खर्च ट्रैक करें' : 'Separate business costs and track deductions.'
              },
              {
                icon: <PieChart className="w-8 h-8 text-blue-500" />,
                title: language === 'hi' ? 'परिवार' : 'Families',
                description: language === 'hi' ? 'बिल प्रबंधन' : 'Monitor household spending in one dashboard.'
              }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-indigo-200 hover:shadow-lg transition-all duration-300">
                <div className="mb-6 p-3 bg-slate-50 rounded-xl inline-block">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="py-24 px-4">
        {/* CHANGED: Background from indigo-600 to white to match the page theme */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl p-12 text-center relative overflow-hidden shadow-xl border border-slate-200">
             
             {/* Background Pattern */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 opacity-50 rounded-full blur-3xl -mr-16 -mt-16"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-50 opacity-50 rounded-full blur-3xl -ml-16 -mb-16"></div>
             
             <h2 className="relative text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Ready to take control?
             </h2>
             <p className="relative text-slate-500 mb-8 max-w-lg mx-auto">
                Join thousands of users who are saving money and avoiding scams with BillWise AI.
             </p>
             {/* Changed button to Primary color since bg is white */}
             <Link
                to="/register"
                className="relative inline-flex items-center px-8 py-3 bg-indigo-600 text-white rounded-xl text-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
              >
                Start for Free
              </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;