import React from 'react';
import heroBgImage from '../images/hero_bg_2.jpg';
import Menu from '../menu/menu';
const HomePage = () => {
  return (
    <>
    <Menu/>
    <div className="site-half">
    <div className="img-bg-1" style={{ backgroundImage: `url(${heroBgImage})` }}></div>
      <div className="container">
        <div className="row no-gutters align-items-stretch">
        <div className="col-md-5 ml-md-auto py-5">
            <span className="caption d-block mb-2 font-secondary font-weight-bold">Empower Your Finances</span>
            <h2 className="site-section-heading text-uppercase font-secondary mb-5">Your Personal Budget Partner</h2>
            <p>Transform your finances with ease. Configure, view, and achieve your goals. Expert guidance at every step.</p>
            <p>With our app, you can easily configure and customize your personal budget to align with your financial goals. Whether you're saving for a dream vacation, planning for major expenses, or just seeking a clearer view of your finances, our expert team is here to guide you through every step of the process.</p>
        </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default HomePage;
