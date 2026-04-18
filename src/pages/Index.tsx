import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServersSection from "@/components/ServersSection";
import MilsimSection from "@/components/MilsimSection";
import ModsSection from "@/components/ModsSection";
import StatusSection from "@/components/StatusSection";
import RadioSection from "@/components/RadioSection";
import MerchSection from "@/components/MerchSection";
import DonationsSection from "@/components/DonationsSection";
import PartnersSection from "@/components/PartnersSection";
import FeedbackSection from "@/components/FeedbackSection";
import Footer from "@/components/Footer";
import HiddenAdminTrigger from "@/components/HiddenAdminTrigger";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <ServersSection />
    <MilsimSection />
    <ModsSection />
    <StatusSection />
    <RadioSection />
    <MerchSection />
    <DonationsSection />
    <PartnersSection />
    <FeedbackSection />
    <Footer />
    <HiddenAdminTrigger />
  </div>
);

export default Index;
