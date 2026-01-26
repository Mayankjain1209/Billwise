import { Play, BookOpen, FileText, Lightbulb } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Learn = () => {
  const { language } = useLanguage();

  // Updated with real images that will fill the thumbnail area nicely
  const videos = [
    {
      id: 1,
      title: language === 'hi' ? 'बिल कैसे पढ़ें' : 'How to Read a Bill',
      thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=640',
      duration: '5:30'
    },
    {
      id: 2,
      title: language === 'hi' ? 'छुपे हुए शुल्क की पहचान' : 'Identifying Hidden Charges',
      thumbnail: 'https://images.unsplash.com/photo-1634733988138-bf2c3a2a13fa?auto=format&fit=crop&q=80&w=640',
      duration: '7:15'
    },
    {
      id: 3,
      title: language === 'hi' ? 'धोखाधड़ी से बचाव' : 'Avoiding Scams',
      thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=640',
      duration: '6:45'
    },
    {
      id: 4,
      title: language === 'hi' ? 'बिल प्रबंधन युक्तियाँ' : 'Bill Management Tips',
      thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=640',
      duration: '8:20'
    }
  ];

  const articles = [
    {
      id: 1,
      title: language === 'hi' ? 'बिजली बिल को समझना' : 'Understanding Electricity Bills',
      excerpt: language === 'hi'
        ? 'बिजली बिल के विभिन्न घटकों और शुल्कों के बारे में जानें।'
        : 'Learn about different components and charges in electricity bills.',
      category: 'Electricity'
    },
    {
      id: 2,
      title: language === 'hi' ? 'क्रेडिट कार्ड स्टेटमेंट' : 'Credit Card Statements',
      excerpt: language === 'hi'
        ? 'अपने क्रेडिट कार्ड स्टेटमेंट को प्रभावी ढंग से पढ़ना और समझना।'
        : 'Effectively read and understand your credit card statements.',
      category: 'Credit Card'
    },
    {
      id: 3,
      title: language === 'hi' ? 'अस्पताल बिल विश्लेषण' : 'Hospital Bill Analysis',
      excerpt: language === 'hi'
        ? 'अस्पताल के बिलों में शुल्कों को समझना और सत्यापित करना।'
        : 'Understanding and verifying charges in hospital bills.',
      category: 'Hospital'
    },
    {
      id: 4,
      title: language === 'hi' ? 'मोबाइल बिल प्रबंधन' : 'Mobile Bill Management',
      excerpt: language === 'hi'
        ? 'अपने मोबाइल और इंटरनेट बिलों को बेहतर तरीके से प्रबंधित करें।'
        : 'Better manage your mobile and internet bills.',
      category: 'Mobile/Internet'
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-slate-900">
            {language === 'hi' ? 'बिल साक्षरता हब' : 'BillWise Academy'}
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            {language === 'hi'
              ? 'बिलों को बेहतर तरीके से समझने के लिए संसाधन और शिक्षा।'
              : 'Master your finances with our curated educational resources.'}
          </p>
        </div>

        {/* Videos Section */}
        <section>
          <div className="flex items-center mb-6">
            <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                 <Play className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              {language === 'hi' ? 'वीडियो ट्यूटोरियल' : 'Video Tutorials'}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
              <div
                key={video.id}
                className="group bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                {/* Changes here: 
                   1. 'h-48': Fixed height to make thumbnails larger/uniform
                   2. 'w-full': Full width of card
                   3. 'object-cover': Ensures image fills space without stretching
                */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Overlay for Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 text-indigo-600 ml-1" />
                    </div>
                  </div>
                  
                  {/* Duration Badge */}
                  <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md text-white px-2 py-0.5 rounded text-xs font-medium">
                    {video.duration}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {video.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Articles Section */}
        <section>
          <div className="flex items-center mb-6">
             <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                 <BookOpen className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              {language === 'hi' ? 'लेख' : 'Guides & Articles'}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {articles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg hover:border-indigo-200 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold tracking-wide uppercase">
                    {article.category}
                  </span>
                  <FileText className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{article.title}</h3>
                <p className="text-slate-600 leading-relaxed">{article.excerpt}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Tips */}
        <section>
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl shadow-xl p-8 md:p-12 text-white relative overflow-hidden">
             {/* Decorative background */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -mr-16 -mt-16"></div>

            <div className="flex items-center mb-8 relative z-10">
                 <Lightbulb className="w-8 h-8 text-amber-300 mr-3" />
                <h2 className="text-2xl font-bold">
                {language === 'hi' ? 'त्वरित युक्तियाँ' : 'Smart Money Tips'}
                </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 relative z-10">
              {[
                language === 'hi'
                  ? 'हमेशा अपने बिलों की तुलना पिछले महीने से करें'
                  : 'Always compare your bills with the previous month',
                language === 'hi'
                  ? 'छुपे हुए शुल्क के लिए बिलों की जांच करें'
                  : 'Check bills for hidden charges',
                language === 'hi'
                  ? 'अनावश्यक सेवाओं को रद्द करें'
                  : 'Cancel unnecessary services',
                language === 'hi'
                  ? 'नियमित रूप से अपने खर्चों को ट्रैक करें'
                  : 'Track your expenses regularly'
              ].map((tip, index) => (
                <div key={index} className="flex items-start bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                  <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-0.5 text-xs font-bold">
                    {index + 1}
                  </div>
                  <p className="text-indigo-100 font-medium">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Learn;