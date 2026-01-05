import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

const About = () => {
  const navigate = useNavigate();

  // Professional campus imagery to fill the visual gaps
  const campusImg = "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2070&auto=format&fit=crop";
  const communityImg = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-[#F7F9F7] font-sans text-text-primary">
      
      {/* 1. HERO / HEADLINE SECTION */}
      <section className="py-16 md:py-24 bg-white border-b border-gray-100">
        <div className="container-custom max-w-4xl mx-auto text-center space-y-4 px-6">
          <h1 className="text-4xl md:text-6xl font-heading font-medium tracking-tight">
            Our <span className="text-sage italic underline decoration-sage/20 underline-offset-[12px]">Mission</span>
          </h1>
          <p className="text-lg md:text-xl text-text-secondary font-light max-w-2xl mx-auto leading-relaxed">
            Connecting campus communities through a sustainable, safe, and exclusive local marketplace.
          </p>
        </div>
      </section>

      {/* 2. THE STORY / TWO-COLUMN SECTION */}
      <section className="py-20 lg:py-28">
        <div className="container-custom grid md:grid-cols-2 gap-16 items-center px-6">
          <div className="space-y-6">
            <h2 className="text-3xl font-heading font-medium text-sage">What is UniThrift?</h2>
            <div className="space-y-4 text-text-secondary leading-relaxed font-light">
              <p>
                UniThrift was born from a simple observation: every semester, thousands of quality items 
                end up in landfills during move-out days, while new students struggle to find affordable essentials.
              </p>
              <p>
                We built a platform exclusively for our university. By requiring a verified <strong>.edu</strong> email 
                for every account, we've eliminated the "sketchy" factor of public marketplaces.
              </p>
            </div>
            <div className="pt-4">
               <Button onClick={() => navigate('/browse')} className="rounded-full px-8">Browse the Marketplace</Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-4 bg-sage/5 rounded-[2.5rem] rotate-2"></div>
            <img 
              src={campusImg} 
              alt="Campus Life" 
              className="relative rounded-[2rem] shadow-xl border-8 border-white object-cover aspect-[4/3]"
            />
          </div>
        </div>
      </section>

      {/* 3. CORE VALUES / TRUST SECTION */}
      <section className="py-20 bg-white rounded-t-[3rem] shadow-inner">
        <div className="container-custom px-6">
          <div className="text-center mb-16 space-y-2">
            <h2 className="font-heading text-3xl text-text-primary">Why We're Different</h2>
            <div className="w-12 h-1 bg-sage/30 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-10 rounded-3xl bg-[#F7F9F7] border border-gray-50 transition-all hover:shadow-md group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🎓</div>
              <h3 className="font-bold uppercase text-xs tracking-widest text-sage mb-3">Exclusively Yours</h3>
              <p className="text-sm text-text-secondary leading-relaxed font-light">
                Only students and faculty can access listings. Your safety is our priority.
              </p>
            </div>

            <div className="p-10 rounded-3xl bg-[#F7F9F7] border border-gray-50 transition-all hover:shadow-md group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🌿</div>
              <h3 className="font-bold uppercase text-xs tracking-widest text-sage mb-3">Sustainable</h3>
              <p className="text-sm text-text-secondary leading-relaxed font-light">
                Reducing campus waste by giving pre-loved items a second, third, or fourth life.
              </p>
            </div>

            <div className="p-10 rounded-3xl bg-[#F7F9F7] border border-gray-100 transition-all hover:shadow-md group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📍</div>
              <h3 className="font-bold uppercase text-xs tracking-widest text-sage mb-3">Local Pickups</h3>
              <p className="text-sm text-text-secondary leading-relaxed font-light">
                No shipping costs. No waiting. Meet at known campus landmarks for easy exchanges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION / FOOTER BRIDGE */}
      <section className="py-20 bg-sage text-white text-center rounded-b-[3rem] mb-12 mx-4">
        <div className="max-w-2xl mx-auto space-y-8 px-6">
          <h2 className="text-4xl font-heading">Ready to join the loop?</h2>
          <p className="opacity-90 font-light">
            Whether you're clearing out your dorm or moving into your first apartment, UniThrift is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/signup')} 
              className="bg-white text-sage hover:bg-off-white px-10 rounded-full font-bold shadow-lg"
            >
              Create Account
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => navigate('/contact')} 
              className="border-white text-white hover:bg-white/10 px-10 rounded-full"
            >
              Ask a Question
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;