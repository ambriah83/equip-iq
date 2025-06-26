
import React from 'react';
import LandingHeader from './LandingHeader';
import HeroSection from './HeroSection';
import ProblemSolutionSection from './ProblemSolutionSection';
import FeaturesSection from './FeaturesSection';
import ROISection from './ROISection';
import CTASection from './CTASection';
import LandingFooter from './LandingFooter';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <LandingHeader />
      <HeroSection />
      <ProblemSolutionSection />
      <FeaturesSection />
      <ROISection />
      <CTASection />
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
