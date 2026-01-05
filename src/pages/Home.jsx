import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CategoryCard from '../components/marketplace/CategoryCard';
import Button from '../components/common/Button';
import { categories } from '../data/mockProducts';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const communityImage = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-[#F7F9F7] font-sans text-text-primary">
      
      {/* 1. ADMIN BAR */}
      {user && !user.isVerified && (
        <div className="bg-sage/10 text-sage text-center py-1.5 text-[10px] uppercase tracking-widest font-bold border-b border-sage/10">
          Email Verification Required to Sell Items
        </div>
      )}

      {/* 2. HERO SECTION - Adjusted for tighter mobile view */}
      <section className="px-3 pt-3 md:px-4 md:pt-4">
        <div className="bg-sage rounded-2xl md:rounded-3xl min-h-[45vh] md:min-h-[60vh] flex items-center relative overflow-hidden">
          <div className="container-custom py-8 md:py-16 grid md:grid-cols-2 gap-8 items-center relative z-10 px-6">
            <div className="text-white space-y-3 md:space-y-4">
              <h1 className="font-heading text-3xl md:text-7xl font-medium leading-tight tracking-tight">
                Buy. Sell. Reuse.<br />
                Inside Your Campus.
              </h1>
              <p className="text-sm md:text-lg opacity-90 max-w-md font-light">
                The premium marketplace exclusive to our university community.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button 
                  onClick={() => navigate('/browse')} 
                  className="bg-green-dark hover:bg-green-hover px-8 py-3 rounded-full text-xs md:text-sm shadow-xl transition-all"
                >
                  Browse Listings
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => navigate('/sell')}
                  className="border-white text-white hover:bg-white/10 px-8 py-3 rounded-full text-xs md:text-sm transition-all"
                >
                  Sell an Item
                </Button>
              </div>
            </div>
            
            <div className="hidden md:flex justify-center items-center">
              <div className="w-64 h-64 lg:w-80 lg:h-80 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/20 flex flex-col items-center justify-center transition-all duration-500 hover:rotate-2">
                <svg className="w-24 h-24 text-white/40 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-4xl font-heading text-white/20 font-bold tracking-[0.2em] italic">UniThrift</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT SECTION - Tighter for Mobile */}
      <section className="py-12 md:py-28 bg-white">
        <div className="container-custom grid md:grid-cols-2 gap-8 md:gap-16 items-center px-6">
          <div className="space-y-4 md:space-y-6">
            <h2 className="font-heading text-2xl md:text-5xl text-text-primary leading-tight">
              Built for our <span className="text-sage italic underline decoration-sage/30 underline-offset-8">Community</span>
            </h2>
            <p className="text-text-secondary leading-relaxed text-sm md:text-lg font-light">
              UniThrift is a dedicated platform for students and faculty to exchange pre-loved goods safely. 
            </p>
          </div>
          <div className="relative">
            <img 
              src={communityImage} 
              alt="Campus Community" 
              className="rounded-xl md:rounded-3xl object-cover aspect-video shadow-lg border-[6px] md:border-[10px] border-[#F0F4F0]"
            />
          </div>
        </div>
      </section>

      {/* 4. CATEGORY DIRECTORY - THE MOBILE GRID FIX */}
      <section className="py-12 md:py-20 bg-[#F7F9F7]">
        <div className="container-custom px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-heading text-2xl md:text-4xl text-text-primary mb-2">Service Directory</h2>
            <div className="w-12 h-1 bg-sage mx-auto rounded-full"></div>
          </div>
          
          {/* grid-cols-2 ensures 2 items per row on mobile, md:grid-cols-6 for PC */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-5">
            {categories.map((cat, index) => {
              const bgShades = ['bg-[#E8EDE8]', 'bg-sage', 'bg-[#DCE3DC]'];
              const currentBg = bgShades[index % bgShades.length];
              const isDark = currentBg === 'bg-sage';
              
              return (
                <div 
                  key={cat.id} 
                  className={`${currentBg} p-4 md:p-7 rounded-xl md:rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1 active:scale-95 cursor-pointer min-h-[140px] md:min-h-[220px] group`}
                  onClick={() => navigate(`/browse?category=${cat.name}`)}
                >
                  <div className="text-2xl md:text-4xl mb-2 md:mb-3 group-hover:scale-110 transition-transform">{cat.icon}</div>
                  <h3 className={`font-bold text-[10px] md:text-base uppercase tracking-tight ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {cat.name}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>
{/* 5. TRUST POINTS - Fixed Privacy Placement & Hover */}
<section className="py-16 md:py-20 bg-white border-y border-gray-100 px-4">
  <div className="container-custom text-center">
    <h3 className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-10">Trust & Safety</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-10">
      {[
        { icon: '🛡️', title: 'Verified Emails', desc: 'Exclusively for students with valid credentials.' },
        { icon: '👁️', title: 'Moderated', desc: 'Every listing is screened to ensure campus quality.' },
        { icon: '🔒', title: 'Privacy First', desc: 'Your data is never shared outside our campus loop.' }
      ].map((point, i) => (
        <div key={i} className="p-6 md:p-8 rounded-2xl transition-all duration-300 hover:bg-[#F0F4F0] group cursor-default border border-transparent hover:border-sage/10">
          <div className="text-3xl text-sage mb-3 group-hover:scale-110 transition-transform">{point.icon}</div>
          <h4 className="font-bold text-sm md:text-base uppercase tracking-tighter mb-1">{point.title}</h4>
          <p className="text-[11px] md:text-xs text-text-secondary leading-relaxed">{point.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>
    </div>
  );
};

export default Home;