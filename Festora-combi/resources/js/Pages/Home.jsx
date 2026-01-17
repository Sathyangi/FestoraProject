import Layout from '../Layouts/Layouts';
import Footer from '../Components/Footer';
import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

import heroImage from '../../assets/hero.jpg';
import collage1 from '../../assets/hero1.jpg';
import collage2 from '../../assets/hero2.jpg';
import collage3 from '../../assets/hero3.jpg';

// Festival images
import vesakImage from '../../assets/vesak1.jpg';
import posonImage from '../../assets/poson1.png';
import kathinaImage from '../../assets/katinapinkama.png';
import thaiPongalImage from '../../assets/thaipongal.jpg';
import mahaShivaratriImage from '../../assets/mahashivarathri.png';
import deepavaliImage from '../../assets/deepawali.png';
import navarathriImage from '../../assets/navarathri.png';
import eidAlFitrImage from '../../assets/eid.jpg';
import eidAlAdhaImage from '../../assets/EID_ALADHA.png';
import mawlidAlNabiImage from '../../assets/nabi.png';
import christmasImage from '../../assets/christmas.png';
import easterImage from '../../assets/easter.png';
import goodFridayImage from '../../assets/goodfriday.png';
import ourLadyOfMadhuImage from '../../assets/LadyofMadhu.png';
import sinhalaTamilNewYearImage from '../../assets/awrudu.jpeg';
import kataragamaDevotionImage from '../../assets/kataragama.png';
import FESTORAImage from '../../assets/bg.png';
import GreetingCardAlert from '../Components/GreetingCardAlert';

const allEvents = [
  { id: 301, name: 'Vesak Poya', location: 'Island-wide', date: '2025-05-12', religion: 'Buddhist', culture: 'Pan-Sri Lankan', imageUrl: vesakImage, },
  { id: 302, name: 'Poson Poya', location: 'Mihintale, Anuradhapura & Island-wide', date: '2025-06-10', religion: 'Buddhist', culture: 'Pan-Sri Lankan', imageUrl: posonImage, },
  { id: 304, name: 'Kathina Pinkama', location: 'Buddhist Temples Island-wide', date: '2025-10-20', religion: 'Buddhist', culture: 'Pan-Sri Lankan', imageUrl: kathinaImage, },
  { id: 305, name: 'Thai Pongal', location: 'Northern & Eastern Provinces, Estate Sector, Island-wide Hindu homes', date: '2026-01-14', religion: 'Hindu', culture: 'Tamil', imageUrl: thaiPongalImage, },
  { id: 306, name: 'Maha Shivaratri', location: 'Hindu Temples Island-wide', date: '2026-02-26', religion: 'Hindu', culture: 'Tamil', imageUrl: mahaShivaratriImage, },
  { id: 307, name: 'Deepavali (Diwali)', location: 'Island-wide (primarily Hindu communities)', date: '2025-10-20', religion: 'Hindu', culture: 'Tamil', imageUrl: deepavaliImage, },
  { id: 308, name: 'Navarathri', location: 'Hindu Temples Island-wide', date: '2025-09-23', religion: 'Hindu', culture: 'Tamil', imageUrl: navarathriImage, },
  { id: 309, name: 'Eid al-Fitr (Ramazan Festival)', location: 'Island-wide', date: '2026-03-31', religion: 'Muslim', culture: 'Islamic', imageUrl: eidAlFitrImage, },
  { id: 310, name: 'Eid al-Adha (Hajj Festival / Festival of Sacrifice)', location: 'Island-wide', date: '2025-06-16', religion: 'Muslim', culture: 'Islamic', imageUrl: eidAlAdhaImage, },
  { id: 311, name: 'Mawlid al-Nabi (Milad-un-Nabi)', location: 'Island-wide', date: '2025-09-15', religion: 'Muslim', culture: 'Islamic', imageUrl: mawlidAlNabiImage, },
  { id: 312, name: 'Christmas', location: 'Island-wide', date: '2025-12-25', religion: 'Christian', culture: 'Christian (Global/Sri Lankan)', imageUrl: christmasImage, },
  { id: 313, name: 'Easter', location: 'Island-wide (particularly Catholic communities)', date: '2026-04-05', religion: 'Christian', culture: 'Christian', imageUrl: easterImage, },
  { id: 314, name: 'Good Friday', location: 'Island-wide (particularly Catholic communities)', date: '2026-04-03', religion: 'Christian', culture: 'Christian', imageUrl: goodFridayImage, },
  { id: 315, name: 'Feast of Our Lady of Madhu', location: 'Our Lady of Madhu Shrine, Mannar', date: '2025-08-15', religion: 'Christian', culture: 'Catholic, Tamil', imageUrl: ourLadyOfMadhuImage, },
  { id: 316, name: 'Sinhala & Tamil New Year (Avurudu)', location: 'Island-wide', date: '2026-04-13', description: 'A major cultural festival celebrated by both Sinhala Buddhists and Tamil Hindus, marking the end of the harvest season and the beginning of the new year. Characterized by traditional rituals (e.g., lighting the hearth at auspicious times, anointing oil), special sweet treats, traditional games, and family visits, fostering national unity.', religion: 'Multi-religious (Buddhist, Hindu)', culture: 'Sinhala, Tamil', imageUrl: sinhalaTamilNewYearImage, },
  { id: 317, name: 'Kataragama Festival (Religious Observances)', location: 'Kataragama', date: '2025-07-26', religion: 'Multi-religious (Buddhist, Hindu, Muslim, Vedda)', culture: 'Traditional, Shared', imageUrl: kataragamaDevotionImage, },
];

function Home() {
  const [selectedReligion, setSelectedReligion] = useState('All');
  const [showMessage, setShowMessage] = useState(false);
  const [mostRecentFestivalInfo, setMostRecentFestivalInfo] = useState(null);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentYear = today.getFullYear();
    const upcomingEvents = allEvents.filter(event => {
      const eventDate = new Date(event.date);
      if (isNaN(eventDate.getTime())) return false;
      return eventDate >= today && eventDate.getFullYear() === currentYear;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
    if (upcomingEvents.length > 0) {
      const mostRecent = upcomingEvents[0];
      const mostRecentDate = new Date(mostRecent.date);
      const diffTime = Math.abs(mostRecentDate.getTime() - today.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setMostRecentFestivalInfo({
        name: mostRecent.name,
        days: diffDays,
      });
    } else {
      setMostRecentFestivalInfo(null);
    }
  }, []);

  const filteredEvents = allEvents.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentYear = today.getFullYear();
    if (isNaN(eventDate.getTime())) return false;
    const isUpcoming = eventDate >= today;
    const isInCurrentYear = eventDate.getFullYear() === currentYear;
    let matchesReligion = false;
    if (selectedReligion === 'All') {
      matchesReligion = true;
    } else if (selectedReligion === 'Multi-religious') {
      matchesReligion = event.religion.startsWith('Multi-religious');
    } else {
      matchesReligion = (event.religion === selectedReligion && !event.religion.startsWith('Multi-religious')) ||
        (selectedReligion === 'Christian' && event.religion === 'Christian (Catholic)');
    }
    return isUpcoming && isInCurrentYear && matchesReligion;
  }).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <>
      {/* Greeting Card Alert Banner */}
      <GreetingCardAlert />
      
      {/* Hero Section */}
      <section className="relative flex flex-col md:flex-row items-center justify-center min-h-[90vh] px-6 py-24 overflow-hidden bg-gradient-to-br from-slate-900 via-gray-800 to-gray-400">
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-gray-500 opacity-20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-400 opacity-10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 w-1/2 h-1/2 bg-white opacity-5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        {/* Hero Content */}
        <div className="relative z-10 max-w-2xl text-center md:text-left animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg animate-slide-in">
            Experience Sri Lankan Culture & Festivals
          </h1>
          <p className="text-lg md:text-2xl text-white mb-8 font-medium animate-fade-in-delay">
            Discover, celebrate, and support the vibrant traditions and events that unite our communities.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start items-center mb-8">
            <Link
              href="/festivals"
              className="inline-block px-8 py-3 rounded-full bg-white text-gray-700 font-semibold text-lg shadow-lg hover:bg-gray-100 transition animate-bounce"
            >
              Explore Festivals
            </Link>
            <Link
              href="/products"
              className="inline-block px-8 py-3 rounded-full bg-gray-700 text-white font-semibold text-lg shadow-lg hover:bg-gray-800 transition"
            >
              Shop Products
            </Link>
          </div>
        </div>
        {/* Hero Image on the right */}
        <div className="relative z-10 mt-10 md:mt-0 md:ml-12 flex-shrink-0 animate-fade-in-right">
          {/* Main Hero Image */}
          <div className="relative w-[340px] h-[340px]">
            <img
              src={heroImage}
              alt="Sri Lankan Festival"
              className="w-full h-full object-cover rounded-3xl shadow-2xl border-4 border-white"
            />
            {/* Collage Images */}
            <img
              src={collage1}
              alt="Collage 1"
              className="absolute -top-8 -left-8 w-28 h-28 object-cover rounded-xl shadow-lg border-4 border-white rotate-[-8deg] hidden md:block"
            />
            <img
              src={collage2}
              alt="Collage 2"
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-28 h-28 object-cover rounded-xl shadow-lg border-4 border-white rotate-[6deg] hidden md:block"
            />
            <img
              src={collage3}
              alt="Collage 3"
              className="absolute top-1/2 -right-10 -translate-y-1/2 w-24 h-24 object-cover rounded-xl shadow-lg border-4 border-white rotate-[12deg] hidden md:block"
            />
          </div>
        </div>
        {/* Centered Scroll Down Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20">
          <span className="text-white text-sm mb-2">Scroll to discover more</span>
          <svg className="w-6 h-6 text-white animate-bounce" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {/* Animations */}
        <style>
          {`
            .animate-fade-in {
              animation: fadeInUp 1.2s cubic-bezier(.39,.575,.565,1) both;
            }
            .animate-fade-in-delay {
              animation: fadeInUp 1.8s cubic-bezier(.39,.575,.565,1) both;
            }
            .animate-slide-in {
              animation: slideInLeft 1.2s cubic-bezier(.39,.575,.565,1) both;
            }
            .animate-fade-in-right {
              animation: fadeInRight 1.4s cubic-bezier(.39,.575,.565,1) both;
            }
            @keyframes fadeInUp {
              0% { opacity: 0; transform: translateY(40px);}
              100% { opacity: 1; transform: translateY(0);}
            }
            @keyframes slideInLeft {
              0% { opacity: 0; transform: translateX(-40px);}
              100% { opacity: 1; transform: translateX(0);}
            }
            @keyframes fadeInRight {
              0% { opacity: 0; transform: translateX(40px);}
              100% { opacity: 1; transform: translateX(0);}
            }
          `}
        </style>
      </section>

      {/* Filter and Upcoming Festivals */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 text-center">Upcoming Festivals</h2>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {['All', 'Buddhist', 'Muslim', 'Hindu', 'Christian', 'Multi-religious'].map(religion => (
              <button
                key={religion}
                className={`px-4 py-2 rounded-full font-semibold border transition ${
                  selectedReligion === religion
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-100'
                }`}
                onClick={() => setSelectedReligion(religion)}
              >
                {religion}
              </button>
            ))}
          </div>
          {mostRecentFestivalInfo && (
            <div className="text-center mb-4">
              <span className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium">
                The next major festival, <b>{mostRecentFestivalInfo.name}</b>, is in {mostRecentFestivalInfo.days} days!
              </span>
            </div>
          )}
          {filteredEvents.length === 0 && (
            <div className="text-center text-red-500 font-medium">
              No upcoming festivals found for the selected filter.
            </div>
          )}
        </div>
        {/* Event Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map(event => (
            <div key={event.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition p-4 flex flex-col">
              <img src={event.imageUrl} alt={event.name} className="w-full h-48 object-cover rounded-xl mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">{event.name}</h3>
              <div className="text-sm text-slate-600 mb-2">{event.location} | {event.date}</div>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-xs">{event.religion}</span>
                <span className="bg-slate-200 text-slate-800 px-3 py-1 rounded-full text-xs">{event.culture}</span>
              </div>
              {event.description && (
                <div className="text-xs text-slate-500 mb-2">{event.description}</div>
              )}
              <Link href="/festivals" className="mt-auto inline-block text-blue-700 hover:underline font-semibold text-sm">
                View Details
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Call-to-Action Circles */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-10 text-center">Explore More with Festora</h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          <Link href="/festivals" className="group">
            <div className="w-64 h-64 rounded-full bg-cover bg-center shadow-xl flex flex-col justify-center items-center transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-105"
              style={{ backgroundImage: `url(${FESTORAImage})` }}>
              <span className="text-2xl font-bold text-white mb-2 drop-shadow">Festivals</span>
              <span className="text-white text-center mb-4 px-4">Dive deeper into Sri Lanka's vibrant cultural and religious celebrations.</span>
              <span className="bg-white text-slate-900 px-4 py-2 rounded-full font-semibold shadow">Explore Now</span>
            </div>
          </Link>
          <Link href="/products" className="group">
            <div className="w-64 h-64 rounded-full bg-cover bg-center shadow-xl flex flex-col justify-center items-center transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-105"
              style={{ backgroundImage: `url(${FESTORAImage})` }}>
              <span className="text-2xl font-bold text-white mb-2 drop-shadow">Products</span>
              <span className="text-white text-center mb-4 px-4">Discover unique local handicrafts, traditional goods, and souvenirs.</span>
              <span className="bg-slate-900 text-white px-4 py-2 rounded-full font-semibold shadow">Shop Now</span>
            </div>
          </Link>
          <Link href="/donate" className="group">
            <div className="w-64 h-64 rounded-full bg-cover bg-center shadow-xl flex flex-col justify-center items-center transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-105"
              style={{ backgroundImage: `url(${FESTORAImage})` }}>
              <span className="text-2xl font-bold text-white mb-2 drop-shadow">Donation</span>
              <span className="text-white text-center mb-4 px-4">Support cultural preservation and community welfare initiatives.</span>
              <span className="bg-blue-700 text-white px-4 py-2 rounded-full font-semibold shadow">Donate Now</span>
            </div>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <div id="about" className="w-full min-h-screen flex flex-col items-center justify-center relative overflow-hidden mb-12 px-0">

        {/* Welcome Section */}
        <section
          className="relative w-full min-h-[260px] md:min-h-[340px] flex items-center justify-center overflow-hidden"
          style={{
            height: '48vh',
            maxHeight: 400,
          }}
          >
          {/* Parallax Background */}
          <div
            className="absolute inset-0 w-full h-full bg-center bg-cover bg-no-repeat"
            style={{
            backgroundImage: `url(${collage2})`,
            backgroundAttachment: 'fixed',
            filter: 'brightness(0.7) blur(1px)',
            zIndex: 1,
            }}
            aria-hidden="true"
          />
          {/* Overlay for extra contrast */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-slate-900/80 via-blue-900/60 to-slate-700/70 z-10" />
          {/* Sticky/Striking Text */}
          <div className="relative z-20 flex flex-col items-center justify-center text-center w-full px-4">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2 tracking-tight drop-shadow-lg">
            Welcome to Festora
            </h2>
            <h3 className="text-lg md:text-xl font-semibold text-blue-200 mb-3 tracking-tight drop-shadow">
            Unveiling Sri Lanka's Heartbeat
            </h3>
            <p className="text-base md:text-lg text-white/90 max-w-xl mx-auto font-medium drop-shadow">
            More than a website, we're a celebration of tradition, spirit, and shared heritage.
            </p>
          </div>

        </section>

        {/* Origin Story */}
        <div className="max-w-5xl mx-auto mb-12 px-4">
          {/* Centered h4 */}
          <h4 className="text-2xl font-bold text-blue-700 mb-6 mt-12 text-center">
            The Spark Behind FESTORA's Celebration
          </h4>
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Left: Image */}
            <div className="flex-shrink-0 w-full md:w-1/2 mb-6 md:mb-0">
            <img
              src={vesakImage}
              alt="Sri Lankan Festival Moment"
              className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-lg"
            />
            </div>
            {/* Right: Content */}
            <div className="w-full md:w-1/2 flex flex-col justify-center">
            <p className="text-base md:text-lg text-slate-700 mb-4">
              Imagine the rhythmic beat of a traditional drum echoing through ancient temples, the vibrant hues of a Vesak lantern illuminating the night, or the joyous laughter during a New Year game under the tropical sun. These are the moments that define Sri Lanka – moments steeped in devotion, history, and communal spirit.
            </p>
            <p className="text-base md:text-lg text-slate-700">
              Festora began with a simple idea: to bring Sri Lanka's vibrant <span className="italic text-blue-900">cultural and religious festivals</span> closer to everyone. We envisioned a digital space where these traditions could be explored and cherished by all. <span className="font-semibold text-blue-900">FESTORA</span> is our tribute to the beauty and spirit of every Sri Lankan celebration.
            </p>
            </div>
          </div>
        </div>

        {/* Pillars */}
        <div className="mb-16 max-w-5xl mx-auto">
          <h4 className="text-2xl font-bold text-center text-slate-900 mb-8">Festora's Pillars of Purpose</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center hover:-translate-y-2 hover:shadow-2xl transition">
            <div className="bg-green-100 text-green-600 rounded-full p-4 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2l4 7h7l-5.5 4.5L19 21l-7-5-7 5 2.5-7.5L1 9h7z" /></svg>
            </div>
            <h5 className="text-lg font-bold mb-2">Explore & Discover</h5>
            <p className="text-slate-600 text-center">
            Discover our comprehensive list of all Sri Lankan cultural and religious festivals. Learn about their history, what happens, and how to join in.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center hover:-translate-y-2 hover:shadow-2xl transition">
            <div className="bg-yellow-100 text-yellow-600 rounded-full p-4 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 7l6 6-6 6M21 7l-6 6 6 6" /></svg>
            </div>
            <h5 className="text-lg font-bold mb-2">Connect & Collect</h5>
            <p className="text-slate-600 text-center">
            Discover unique Sri Lankan handicrafts, traditional goods, and souvenirs. Our marketplace directly supports local artisans and preserves age-old skills.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center hover:-translate-y-2 hover:shadow-2xl transition">
            <div className="bg-red-100 text-red-600 rounded-full p-4 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 21l-8-8 8-8 8 8-8 8z" /></svg>
            </div>
            <h5 className="text-lg font-bold mb-2">Give & Grow</h5>
            <p className="text-slate-600 text-center">
            Extend the spirit of generosity. Contribute directly to vital humanitarian and cultural organizations across Sri Lanka, ensuring a lasting positive impact.
            </p>
          </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mb-16 max-w-5xl mx-auto">
          <p className="text-xl text-slate-700 mb-6">Ready to immerse yourself in the magic of Sri Lanka with <span className="font-bold text-blue-700">FESTORA</span>?</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/festivals" className="px-8 py-3 rounded-full bg-blue-700 text-white font-semibold shadow hover:bg-blue-800 transition text-lg">
            Start Your Discovery
          </Link>
          <Link href="/donate" className="px-8 py-3 rounded-full bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition text-lg">
            Support a Cause
          </Link>
          </div>
        </div>

        {/* Religious Harmony Contacts */}
        <div className="mb-16 max-w-5xl mx-auto">
          <h4 className="text-2xl font-bold text-center text-slate-900 mb-4">Religious Harmony Contacts</h4>
          <p className="text-center text-slate-600 mb-8">
          Sri Lanka celebrates four major religions. Connect with each faith's dedicated departments below.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Buddhism */}
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex items-center mb-2">
            <span className="inline-block bg-yellow-100 text-yellow-700 rounded-full p-2 mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
            </span>
            <span className="font-bold text-lg">Department of Buddhist Affairs</span>
            </div>
            <div className="text-slate-600 text-sm mb-2">
            <div>No. 123, Bauddhaloka Mawatha, Colombo 07</div>
            <div>+94 11 269 4300</div>
            <div>buddhistaffairs@gov.lk</div>
            <div>www.buddhism.gov.lk</div>
            </div>
          </div>
          {/* Hinduism */}
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex items-center mb-2">
            <span className="inline-block bg-pink-100 text-pink-700 rounded-full p-2 mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20" /></svg>
            </span>
            <span className="font-bold text-lg">Department of Hindu Religious and Cultural Affairs</span>
            </div>
            <div className="text-slate-600 text-sm mb-2">
            <div>No. 56, Hindu College Lane, Colombo 10</div>
            <div>+94 11 267 2444</div>
            <div>hinduaffairs@gov.lk</div>
            <div>www.hindu.gov.lk</div>
            </div>
          </div>
          {/* Islam */}
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex items-center mb-2">
            <span className="inline-block bg-blue-100 text-blue-700 rounded-full p-2 mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
            </span>
            <span className="font-bold text-lg">Department of Muslim Religious and Cultural Affairs</span>
            </div>
            <div className="text-slate-600 text-sm mb-2">
            <div>No. 89, Maligawatta Road, Colombo 10</div>
            <div>+94 11 243 3546</div>
            <div>muslimaffairs@gov.lk</div>
            <div>www.muslimaffairs.gov.lk</div>
            </div>
          </div>
          {/* Christianity */}
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex items-center mb-2">
            <span className="inline-block bg-green-100 text-green-700 rounded-full p-2 mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20" /></svg>
            </span>
            <span className="font-bold text-lg">Department of Christian Religious Affairs</span>
            </div>
            <div className="text-slate-600 text-sm mb-2">
            <div>No. 34, Church Street, Colombo 01</div>
            <div>+94 11 232 8744</div>
            <div>christianaffairs@gov.lk</div>
            <div>www.christian.gov.lk</div>
            </div>
          </div>
          </div>
        </div>

        {/* Contact Us */}
        <div className="bg-gradient-to-br from-green-50 via-white to-blue-50 rounded-3xl shadow-xl p-8 md:p-12">
          <h4 className="text-2xl font-bold text-center text-green-700 mb-4">Get in Touch with Cultural Harmony</h4>
          <p className="text-center text-slate-700 mb-6">
          For collaboration, inquiries, or blessings of support, we welcome you to reach out to Sri Lanka's Ministry of Cultural Affairs and its dedicated branches that celebrate every spiritual heartbeat of the nation.
          </p>
          <div className="text-center text-slate-700">
          <div className="font-semibold mb-1">Ministry of Buddhasasana, Religious and Cultural Affairs</div>
          <div>No. 175, Dr. N.M. Perera Mawatha, Colombo 08, Sri Lanka</div>
          <div>+94 11 2694231 / +94 11 2687780</div>
          <div>info@cultural.gov.lk</div>
          </div>
        </div>
        
      </div>
      <Footer />
    </>
  );
}

Home.layout = (page) => <Layout children={page} />;

export default Home;