import React from 'react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-[#F7F9F7] py-16 px-4">
      <div className="container-custom max-w-3xl mx-auto bg-white p-12 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h1 className="text-3xl font-heading font-medium mb-8">Privacy Policy</h1>
        <div className="space-y-8 text-text-secondary leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-bold text-sage uppercase tracking-tighter">1. Data Collection</h2>
            <p className="font-light">We only collect data necessary for campus verification. Your personal student ID and contact info are never shared with third-party advertisers.</p>
          </section>
          <section className="space-y-3">
            <h2 className="font-bold text-sage uppercase tracking-tighter">2. Listing Safety</h2>
            <p className="font-light">Admin moderation ensures that your listings are only visible to the verified university community, reducing the risk of external scams.</p>
          </section>
          <section className="space-y-3">
            <h2 className="font-bold text-sage uppercase tracking-tighter">3. Cookies</h2>
            <p className="font-light">We use essential cookies to keep you logged in and remember your wishlist items. No tracking pixels are used.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;