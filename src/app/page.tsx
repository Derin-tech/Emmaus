import LandingNavbar from "@/components/landing/LandingNavbar";
import Hero from "@/components/landing/Hero";
import Problem from "@/components/landing/Problem";
import HowItWorks from "@/components/landing/HowItWorks";
import ExploreCategories from "@/components/landing/ExploreCategories";
import Trust from "@/components/landing/Trust";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />
      <main>
        <Hero />
        <ExploreCategories />
        <Problem />
        <HowItWorks />
        <Trust />
      </main>
      <Footer />
    </div>
  );
}
