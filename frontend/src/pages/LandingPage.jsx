import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import WhatsAppFloat from '../components/layout/WhatsAppFloat';
import HeroSection from '../components/sections/HeroSection';
import FeaturedEvent from '../components/sections/FeaturedEvent';
import TopEvents from '../components/sections/TopEvents';
import useEvents from '../hooks/useEvents';

function LandingPage() {
  const { events, featuredEvent, loading, error } = useEvents();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading amazing experiences...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Events</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-full font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="LandingPage">
      <Navbar/>
      
      <main>
        <HeroSection/>
        <FeaturedEvent event={featuredEvent} />
        <TopEvents events={events} />
      </main>

      <Footer />
      <WhatsAppFloat />
      
    </div>
  );
}

export default LandingPage;
