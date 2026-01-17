import Layout from '../Layouts/Layouts';
import Footer from '../Components/Footer';
import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

import heroImage from '../../assets/hero.jpg';
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
import GreetingCardModal from '../Components/GreetingCardModal';

const allFestivals = [
  {
    id: '301',
    name: 'Vesak Poya',
    location: 'Island-wide',
    date: '2025-05-12',
    description: 'The most sacred Buddhist festival, commemorating the birth, enlightenment, and passing of Lord Buddha.',
    longDescription: `Vesak Poya is the most important Buddhist festival in Sri Lanka. It commemorates the birth, enlightenment, and passing away of Lord Buddha. The entire country is decorated with lanterns and lights, and devotees engage in religious observances at temples. Many people also participate in acts of charity and kindness during this period.

**Key Rituals:**
- Visiting temples and offering flowers
- Lighting Vesak lanterns (Vesak koodu)
- Dansal (free food stalls) for the public
- Sil campaigns (observing precepts)

**Significant Locations:**
- Colombo city
- Anuradhapura
- Kandy
- Galle

**Typical Schedule:**
- Morning: Temple visits and almsgiving
- Afternoon: Religious sermons and meditation
- Evening: Lantern displays and processions
`,
    history: "Vesak has been celebrated for centuries and is recognized as a public holiday in Sri Lanka. It marks the three major events in Buddha's life.",
    customs: [
      "Lighting lanterns and lamps",
      "Offering alms to the needy",
      "Participating in Sil campaigns"
    ],
    places: [
      "Colombo", "Anuradhapura", "Kandy", "Galle"
    ],
    times: [
      "Morning: Temple visits",
      "Evening: Lantern displays"
    ],
    highlights: [
      "Island-wide lantern displays",
      "Dansal (free food stalls)",
      "Religious processions"
    ],
    schedule: [
      { time: "6:00 AM", activity: "Temple visit & offerings" },
      { time: "12:00 PM", activity: "Almsgiving" },
      { time: "7:00 PM", activity: "Lantern lighting & processions" }
    ],
    religion: 'Buddhist',
    culture: 'Pan-Sri Lankan',
    imageUrl: vesakImage
  },
  {
    id: '302',
    name: 'Poson Poya',
    location: 'Mihintale, Anuradhapura & Island-wide',
    date: '2025-06-10',
    description: 'Commemorates the introduction of Buddhism to Sri Lanka by Arahat Mahinda in the 3rd century BC.',
    longDescription: `Poson Poya is the second most important Buddhist festival in Sri Lanka. It marks the arrival of Arahat Mahinda, who introduced Buddhism to the island. The main celebrations are held at Mihintale, where devotees gather for religious observances.

**Key Rituals:**
- Pilgrimage to Mihintale
- Sil campaigns and meditation
- Dansal (free food stalls)
- Illuminated pandals and lanterns

**Significant Locations:**
- Mihintale
- Anuradhapura

**Typical Schedule:**
- Morning: Pilgrimage and temple visits
- Day: Almsgiving and meditation
- Night: Lantern displays and cultural shows
`,
    history: "Poson Poya celebrates the arrival of Arahat Mahinda from India, which led to the establishment of Buddhism in Sri Lanka.",
    customs: [
      "Pilgrimage to Mihintale",
      "Observing Sil (precepts)",
      "Offering alms"
    ],
    places: [
      "Mihintale", "Anuradhapura"
    ],
    times: [
      "Morning: Pilgrimage",
      "Night: Lantern displays"
    ],
    highlights: [
      "Mass pilgrimages",
      "Dansal (free food stalls)",
      "Religious observances"
    ],
    schedule: [
      { time: "5:00 AM", activity: "Pilgrimage to Mihintale" },
      { time: "10:00 AM", activity: "Almsgiving" },
      { time: "8:00 PM", activity: "Lantern displays" }
    ],
    religion: 'Buddhist',
    culture: 'Pan-Sri Lankan',
    imageUrl: posonImage
  },
  {
    id: '304',
    name: 'Kathina Pinkama',
    location: 'Buddhist Temples Island-wide',
    date: '2025-10-20',
    description: 'An annual alms-giving ceremony held at the end of the three-month "Vassana" retreat.',
    longDescription: `Kathina Pinkama is a significant Buddhist ceremony marking the end of the Vassana (rainy season retreat). Lay devotees offer new robes and other requisites to monks who have completed the retreat.
**Key Rituals:**
- Offering of Kathina robes
- Almsgiving ceremonies
- Processions and chanting

**Significant Locations:**
- Buddhist temples across Sri Lanka

**Typical Schedule:**
- Morning: Robe offering
- Day: Almsgiving and sermons
- Evening: Chanting and processions
`,
    history: "Kathina Pinkama has been observed since the time of the Buddha, symbolizing unity and gratitude between laypeople and monks.",
    customs: [
      "Offering Kathina robes",
      "Participating in processions",
      "Listening to sermons"
    ],
    places: [
      "All Buddhist temples"
    ],
    times: [
      "Morning: Robe offering",
      "Evening: Chanting"
    ],
    highlights: [
      "Colorful processions",
      "Community almsgiving"
    ],
    schedule: [
      { time: "7:00 AM", activity: "Kathina robe offering" },
      { time: "11:00 AM", activity: "Almsgiving" },
      { time: "6:00 PM", activity: "Chanting and processions" }
    ],
    religion: 'Buddhist',
    culture: 'Pan-Sri Lankan',
    imageUrl: kathinaImage
  },
  {
    id: '305',
    name: 'Thai Pongal',
    location: 'Northern & Eastern Provinces, Estate Sector, Island-wide Hindu homes',
    date: '2026-01-14',
    description: 'A vibrant harvest festival celebrated by the Tamil community, offering thanks to the Sun God.',
    longDescription: `Thai Pongal is a major Tamil harvest festival dedicated to the Sun God. Families prepare a special dish called 'Pongal' and offer it to the Sun, thanking for a bountiful harvest.

**Key Rituals:**
- Cooking Pongal rice in new pots
- Decorating homes with kolam (rice flour art)
- Worshipping the Sun God

**Significant Locations:**
- Jaffna
- Batticaloa
- Estate sector Tamil communities

**Typical Schedule:**
- Morning: Pongal preparation and prayers
- Day: Visiting relatives and sharing food
- Evening: Cultural performances
`,
    history: "Thai Pongal has been celebrated for centuries by Tamil communities in Sri Lanka and South India.",
    customs: [
      "Cooking Pongal rice outdoors",
      "Drawing kolam patterns",
      "Worshipping the Sun"
    ],
    places: [
      "Jaffna", "Batticaloa", "Estate sector"
    ],
    times: [
      "Morning: Pongal preparation",
      "Evening: Cultural events"
    ],
    highlights: [
      "Kolam decorations",
      "Traditional music and dance"
    ],
    schedule: [
      { time: "6:30 AM", activity: "Pongal preparation" },
      { time: "10:00 AM", activity: "Prayers and offerings" },
      { time: "7:00 PM", activity: "Cultural performances" }
    ],
    religion: 'Hindu',
    culture: 'Tamil',
    imageUrl: thaiPongalImage
  },
  {
    id: '306',
    name: 'Maha Shivaratri',
    location: 'Hindu Temples Island-wide',
    date: '2026-02-26',
    description: 'The "Great Night of Shiva" is a significant Hindu festival dedicated to Lord Shiva.',
    longDescription: `Maha Shivaratri is a Hindu festival dedicated to Lord Shiva. Devotees fast, keep vigil, and offer prayers throughout the night at temples.

**Key Rituals:**
- Night-long vigils and prayers
- Fasting and meditation
- Offering milk and fruits to Shiva lingam

**Significant Locations:**
- Koneswaram Temple, Trincomalee
- Munneswaram Temple, Chilaw

**Typical Schedule:**
- Evening: Temple rituals begin
- Night: Continuous chanting and prayers
- Dawn: Final offerings
`,
    history: "Maha Shivaratri is celebrated annually by Hindus worldwide, marking the cosmic dance of Lord Shiva.",
    customs: [
      "Night-long prayers",
      "Fasting",
      "Temple visits"
    ],
    places: [
      "Koneswaram Temple", "Munneswaram Temple"
    ],
    times: [
      "Evening: Rituals start",
      "Night: Vigil"
    ],
    highlights: [
      "Devotional music",
      "Large gatherings at temples"
    ],
    schedule: [
      { time: "6:00 PM", activity: "Temple rituals" },
      { time: "12:00 AM", activity: "Night-long prayers" },
      { time: "5:00 AM", activity: "Final offerings" }
    ],
    religion: 'Hindu',
    culture: 'Tamil',
    imageUrl: mahaShivaratriImage
  },
  {
    id: '307',
    name: 'Deepavali (Diwali)',
    location: 'Island-wide (primarily Hindu communities)',
    date: '2025-10-20',
    description: 'The "Festival of Lights" celebrated by Hindus.',
    longDescription: `Deepavali, also known as Diwali, is the Hindu festival of lights. Homes are decorated with oil lamps and fireworks, symbolizing the victory of light over darkness.

**Key Rituals:**
- Lighting oil lamps (diyas)
- Fireworks and sweets
- Visiting relatives and friends

**Significant Locations:**
- Jaffna
- Colombo Hindu neighborhoods

**Typical Schedule:**
- Morning: Ritual baths and prayers
- Day: Visiting relatives
- Night: Lighting lamps and fireworks
`,
    history: "Deepavali celebrates the return of Lord Rama after defeating Ravana, symbolizing the triumph of good over evil.",
    customs: [
      "Lighting lamps",
      "Sharing sweets",
      "Fireworks"
    ],
    places: [
      "Jaffna", "Colombo"
    ],
    times: [
      "Morning: Ritual bath",
      "Night: Fireworks"
    ],
    highlights: [
      "Lamp decorations",
      "Firework displays"
    ],
    schedule: [
      { time: "7:00 AM", activity: "Ritual bath and prayers" },
      { time: "6:00 PM", activity: "Lighting lamps" },
      { time: "8:00 PM", activity: "Fireworks" }
    ],
    religion: 'Hindu',
    culture: 'Tamil',
    imageUrl: deepavaliImage
  },
  {
    id: '308',
    name: 'Navarathri',
    location: 'Hindu Temples Island-wide',
    date: '2025-09-23',
    description: 'A nine-night festival dedicated to the worship of the Hindu divine feminine.',
    longDescription: `Navarathri is a nine-night Hindu festival celebrating the divine feminine. Each night is dedicated to a different aspect of the goddess.

**Key Rituals:**
- Daily prayers and offerings
- Cultural performances
- Displaying dolls (kolu)

**Significant Locations:**
- Hindu temples across Sri Lanka

**Typical Schedule:**
- Evening: Prayers and music
- Night: Cultural events
`,
    history: "Navarathri is celebrated by Hindus worldwide, honoring the goddess Durga and her manifestations.",
    customs: [
      "Displaying kolu dolls",
      "Daily prayers",
      "Cultural performances"
    ],
    places: [
      "Hindu temples"
    ],
    times: [
      "Evening: Prayers",
      "Night: Events"
    ],
    highlights: [
      "Nine nights of celebrations",
      "Traditional music and dance"
    ],
    schedule: [
      { time: "6:00 PM", activity: "Prayers" },
      { time: "7:30 PM", activity: "Cultural performances" }
    ],
    religion: 'Hindu',
    culture: 'Tamil',
    imageUrl: navarathriImage
  },
  {
    id: '309',
    name: 'Eid al-Fitr (Ramazan Festival)',
    location: 'Island-wide',
    date: '2026-03-31',
    description: 'Marks the end of Ramadan, the Islamic holy month of fasting.',
    longDescription: `Eid al-Fitr is a major Islamic festival marking the end of Ramadan. Families gather for prayers, feasting, and charity.

**Key Rituals:**
- Eid prayers at mosques
- Giving zakat (charity)
- Sharing festive meals

**Significant Locations:**
- Colombo Grand Mosque
- Kattankudy

**Typical Schedule:**
- Morning: Eid prayers
- Day: Visiting relatives and feasting
- Evening: Community celebrations
`,
    history: "Eid al-Fitr is celebrated by Muslims worldwide, marking the end of a month of fasting and spiritual reflection.",
    customs: [
      "Eid prayers",
      "Charity (zakat)",
      "Family gatherings"
    ],
    places: [
      "Colombo", "Kattankudy"
    ],
    times: [
      "Morning: Prayers",
      "Day: Feasting"
    ],
    highlights: [
      "Large congregational prayers",
      "Festive meals"
    ],
    schedule: [
      { time: "7:00 AM", activity: "Eid prayers" },
      { time: "12:00 PM", activity: "Family feasts" },
      { time: "6:00 PM", activity: "Community events" }
    ],
    religion: 'Muslim',
    culture: 'Islamic',
    imageUrl: eidAlFitrImage
  },
  {
    id: '310',
    name: 'Eid al-Adha (Hajj Festival / Festival of Sacrifice)',
    location: 'Island-wide',
    date: '2025-06-16',
    description: 'The second major Islamic festival, coinciding with the annual Hajj pilgrimage.',
    longDescription: `Eid al-Adha commemorates the willingness of Ibrahim (Abraham) to sacrifice his son as an act of obedience to God. It is marked by prayers and the sacrifice of animals.

**Key Rituals:**
- Eid prayers
- Animal sacrifice (Qurbani)
- Distribution of meat to the needy

**Significant Locations:**
- Mosques across Sri Lanka

**Typical Schedule:**
- Morning: Eid prayers
- Day: Sacrifice and distribution
- Evening: Family gatherings
`,
    history: "Eid al-Adha is celebrated by Muslims worldwide, coinciding with the Hajj pilgrimage in Mecca.",
    customs: [
      "Animal sacrifice",
      "Charity",
      "Family gatherings"
    ],
    places: [
      "Mosques island-wide"
    ],
    times: [
      "Morning: Prayers",
      "Day: Sacrifice"
    ],
    highlights: [
      "Community feasts",
      "Charitable giving"
    ],
    schedule: [
      { time: "7:00 AM", activity: "Eid prayers" },
      { time: "10:00 AM", activity: "Animal sacrifice" },
      { time: "1:00 PM", activity: "Distribution of meat" }
    ],
    religion: 'Muslim',
    culture: 'Islamic',
    imageUrl: eidAlAdhaImage
  },
  {
    id: '311',
    name: 'Mawlid al-Nabi (Milad-un-Nabi)',
    location: 'Island-wide',
    date: '2025-09-15',
    description: 'The birthday of Prophet Muhammad.',
    longDescription: `Mawlid al-Nabi celebrates the birth of Prophet Muhammad. The day is marked by prayers, sermons, and processions.

**Key Rituals:**
- Special prayers and sermons
- Processions and feasts
- Recitation of poetry

**Significant Locations:**
- Mosques and Islamic centers

**Typical Schedule:**
- Morning: Prayers and sermons
- Day: Processions
- Evening: Community feasts
`,
    history: "Mawlid al-Nabi is observed by Muslims to honor the birth and teachings of Prophet Muhammad.",
    customs: [
      "Reciting poetry",
      "Community feasts",
      "Processions"
    ],
    places: [
      "Mosques", "Islamic centers"
    ],
    times: [
      "Morning: Prayers",
      "Evening: Feasts"
    ],
    highlights: [
      "Colorful processions",
      "Religious sermons"
    ],
    schedule: [
      { time: "8:00 AM", activity: "Prayers and sermons" },
      { time: "2:00 PM", activity: "Processions" },
      { time: "7:00 PM", activity: "Community feasts" }
    ],
    religion: 'Muslim',
    culture: 'Islamic',
    imageUrl: mawlidAlNabiImage
  },
  {
    id: '312',
    name: 'Christmas',
    location: 'Island-wide',
    date: '2025-12-25',
    description: 'Celebrated by Christian communities worldwide, commemorating the birth of Jesus Christ.',
    longDescription: `Christmas is celebrated by Christians to mark the birth of Jesus Christ. Churches hold midnight masses, and homes are decorated with trees and lights.

**Key Rituals:**
- Midnight mass at churches
- Decorating Christmas trees
- Exchanging gifts

**Significant Locations:**
- St. Lucia's Cathedral, Colombo
- Churches island-wide

**Typical Schedule:**
- Night: Midnight mass
- Day: Family gatherings and meals
- Evening: Carol singing
`,
    history: "Christmas has been celebrated in Sri Lanka since colonial times and is a public holiday.",
    customs: [
      "Midnight mass",
      "Gift giving",
      "Carol singing"
    ],
    places: [
      "Colombo", "Kandy", "Negombo"
    ],
    times: [
      "Night: Mass",
      "Day: Meals"
    ],
    highlights: [
      "Decorated churches",
      "Christmas markets"
    ],
    schedule: [
      { time: "12:00 AM", activity: "Midnight mass" },
      { time: "1:00 PM", activity: "Family lunch" },
      { time: "7:00 PM", activity: "Carol singing" }
    ],
    religion: 'Christian',
    culture: 'Christian (Global/Sri Lankan)',
    imageUrl: christmasImage
  },
  {
    id: '313',
    name: 'Easter',
    location: 'Island-wide (particularly Catholic communities)',
    date: '2026-04-05',
    description: 'The most important Christian festival, celebrating the resurrection of Jesus Christ.',
    longDescription: `Easter celebrates the resurrection of Jesus Christ. The week leading up to Easter is marked by processions, prayers, and special masses.

**Key Rituals:**
- Good Friday processions
- Easter Sunday mass
- Sharing Easter eggs

**Significant Locations:**
- Churches across Sri Lanka

**Typical Schedule:**
- Friday: Good Friday processions
- Sunday: Easter mass and celebrations
`,
    history: "Easter is the most significant event in the Christian calendar, celebrated with great devotion in Sri Lanka.",
    customs: [
      "Processions",
      "Easter eggs",
      "Special prayers"
    ],
    places: [
      "Colombo", "Negombo"
    ],
    times: [
      "Friday: Processions",
      "Sunday: Mass"
    ],
    highlights: [
      "Good Friday processions",
      "Easter egg hunts"
    ],
    schedule: [
      { time: "3:00 PM", activity: "Good Friday procession" },
      { time: "8:00 AM", activity: "Easter Sunday mass" },
      { time: "12:00 PM", activity: "Family lunch" }
    ],
    religion: 'Christian',
    culture: 'Christian',
    imageUrl: easterImage
  },
  {
    id: '314',
    name: 'Good Friday',
    location: 'Island-wide (particularly Catholic communities)',
    date: '2026-04-03',
    description: 'A solemn day commemorating the crucifixion of Jesus Christ.',
    longDescription: `Good Friday is observed by Christians as a day of mourning and reflection on the crucifixion of Jesus Christ.

**Key Rituals:**
- Church services and prayers
- Processions with crosses
- Fasting and abstinence

**Significant Locations:**
- Churches across Sri Lanka

**Typical Schedule:**
- Afternoon: Processions
- Evening: Prayers and reflection
`,
    history: "Good Friday is part of Holy Week and is observed with solemnity by Christians worldwide.",
    customs: [
      "Processions",
      "Fasting",
      "Church services"
    ],
    places: [
      "Colombo", "Negombo"
    ],
    times: [
      "Afternoon: Processions",
      "Evening: Prayers"
    ],
    highlights: [
      "Solemn processions",
      "Community prayers"
    ],
    schedule: [
      { time: "3:00 PM", activity: "Procession" },
      { time: "6:00 PM", activity: "Prayers" }
    ],
    religion: 'Christian',
    culture: 'Christian',
    imageUrl: goodFridayImage
  },
  {
    id: '315',
    name: 'Feast of Our Lady of Madhu',
    location: 'Our Lady of Madhu Shrine, Mannar',
    date: '2025-08-15',
    description: 'A significant annual pilgrimage for Roman Catholics in Sri Lanka.',
    longDescription: `The Feast of Our Lady of Madhu is a major Catholic pilgrimage in Sri Lanka. Thousands of devotees travel to the Madhu Shrine for prayers and blessings.

**Key Rituals:**
- Pilgrimage to Madhu Shrine
- Special masses and processions
- Lighting candles and offering flowers

**Significant Locations:**
- Madhu Shrine, Mannar

**Typical Schedule:**
- Morning: Pilgrimage and prayers
- Day: Mass and blessings
- Evening: Processions
`,
    history: "The Madhu Shrine is one of the oldest and most revered Catholic sites in Sri Lanka.",
    customs: [
      "Pilgrimage",
      "Lighting candles",
      "Offering flowers"
    ],
    places: [
      "Madhu Shrine"
    ],
    times: [
      "Morning: Pilgrimage",
      "Evening: Procession"
    ],
    highlights: [
      "Large gatherings",
      "Special blessings"
    ],
    schedule: [
      { time: "7:00 AM", activity: "Pilgrimage" },
      { time: "10:00 AM", activity: "Mass" },
      { time: "6:00 PM", activity: "Procession" }
    ],
    religion: 'Christian',
    culture: 'Catholic, Tamil',
    imageUrl: ourLadyOfMadhuImage
  },
  {
    id: '316',
    name: 'Sinhala & Tamil New Year (Avurudu)',
    location: 'Island-wide',
    date: '2026-04-13',
    description: 'A major cultural festival celebrated by both Sinhala Buddhists and Tamil Hindus.',
    longDescription: `Sinhala & Tamil New Year, known as Avurudu, marks the end of the harvest season and the beginning of a new year. It is celebrated with traditional games, rituals, and feasting.

**Key Rituals:**
- Lighting the hearth at the auspicious time
- Preparing traditional sweets
- Visiting relatives and exchanging gifts

**Significant Locations:**
- All over Sri Lanka

**Typical Schedule:**
- Morning: Rituals and cooking
- Day: Visiting relatives
- Evening: Traditional games
`,
    history: "Avurudu is rooted in ancient agrarian traditions and is celebrated by both Sinhala and Tamil communities.",
    customs: [
      "Lighting the hearth",
      "Preparing kiribath (milk rice)",
      "Traditional games"
    ],
    places: [
      "All regions"
    ],
    times: [
      "Morning: Rituals",
      "Evening: Games"
    ],
    highlights: [
      "Traditional sweets",
      "Cultural games"
    ],
    schedule: [
      { time: "7:00 AM", activity: "Lighting the hearth" },
      { time: "12:00 PM", activity: "Family lunch" },
      { time: "4:00 PM", activity: "Games and celebrations" }
    ],
    religion: 'Multi-religious',
    culture: 'Sinhala, Tamil',
    imageUrl: sinhalaTamilNewYearImage
  },
  {
    id: '317',
    name: 'Kataragama Festival (Religious Observances)',
    location: 'Kataragama',
    date: '2025-07-26',
    description: 'Multi-religious festival with devotees from Buddhist, Hindu, Muslim, and Vedda communities.',
    longDescription: `The Kataragama Festival is a unique multi-religious event attracting thousands of pilgrims from various faiths. The festival features processions, fire-walking, and devotional music.

**Key Rituals:**
- Processions with sacred relics
- Fire-walking ceremonies
- Devotional music and dance

**Significant Locations:**
- Kataragama temple complex

**Typical Schedule:**
- Morning: Ritual bathing in the river
- Day: Offerings and prayers
- Night: Processions and fire-walking
`,
    history: "Kataragama has been a center of pilgrimage for centuries, revered by Buddhists, Hindus, Muslims, and Veddas.",
    customs: [
      "Fire-walking",
      "Processions",
      "Devotional music"
    ],
    places: [
      "Kataragama"
    ],
    times: [
      "Morning: River bathing",
      "Night: Fire-walking"
    ],
    highlights: [
      "Fire-walking",
      "Multi-faith processions"
    ],
    schedule: [
      { time: "6:00 AM", activity: "River bathing" },
      { time: "10:00 AM", activity: "Offerings and prayers" },
      { time: "8:00 PM", activity: "Processions and fire-walking" }
    ],
    religion: 'Multi-religious',
    culture: 'Traditional',
    imageUrl: kataragamaDevotionImage
  }
];

function Festivals() {
  const [selectedReligion, setSelectedReligion] = useState('All');
  const [modalFestival, setModalFestival] = useState(null);
  const [showGreetingCard, setShowGreetingCard] = useState(false);

  // Check URL for greeting card parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('createGreetingCard') === 'true') {
      setShowGreetingCard(true);
    }
  }, []);

  const filteredFestivals = allFestivals.filter(event => {
    if (selectedReligion === 'All') return true;
    if (selectedReligion === 'Multi-religious') return event.religion.startsWith('Multi-religious');
    return event.religion === selectedReligion || (selectedReligion === 'Christian' && event.religion === 'Christian (Global/Sri Lankan)');
  });

  return (
    <>
      {/* Page Header */}
      <header className="relative bg-gradient-to-br from-slate-1000 via-gray-1100 to-gray-700 py-20 mb-10 overflow-hidden">
        {/* Background fade image */}
        <img
          src={heroImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-100"
          style={{ zIndex: 1 }}
          aria-hidden="true"
        />
        {/* Gradient overlay for fade effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-gray-800/60 to-gray-400/80" style={{ zIndex: 2 }} />
        {/* Content */}
        <div className="relative max-w-4xl mx-auto px-4 text-center z-10 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">All Sri Lankan Festivals</h1>
          <p className="text-lg md:text-xl text-white/80 mb-6">
            Explore the diversity of Sri Lanka's religious and cultural festivals. Filter by religion or browse all!
          </p>
          <button
            className="mt-2 px-6 py-3 rounded-full bg-black text-white font-bold shadow-lg hover:bg-slate-800 transition text-lg"
            onClick={() => setShowGreetingCard(true)}
          >
            🎉 Create Greeting Card
          </button>
          {/* Scroll Down Animation - centered below the button */}
          <div className="mt-16 flex flex-col items-center animate-bounce">
            <span className="text-white font-semibold text-base mb-1 drop-shadow">Scroll down to view more</span>
            <svg className="w-6 h-6 text-white drop-shadow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </header>

      {/* Filter */}
      <section className="max-w-7xl mx-auto px-4 mb-10">
        <div className="flex flex-wrap justify-center gap-2 mb-8">
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
      </section>

      {/* Festival Cards */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFestivals.map(event => (
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
              <button
                onClick={() => setModalFestival(event)}
                className="mt-auto inline-block text-blue-700 hover:underline font-semibold text-sm"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
        {filteredFestivals.length === 0 && (
          <div className="text-center text-red-500 font-medium mt-10">
            No festivals found for the selected filter.
          </div>
        )}
      </section>

      {/* Modal */}
      {modalFestival && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-4 relative animate-fade-in-up">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold"
              onClick={() => setModalFestival(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex flex-col gap-6 p-8 max-h-[80vh] overflow-y-auto items-start">
              {/* Image at the top */}
              <img
                src={modalFestival.imageUrl}
                alt={modalFestival.name}
                className="w-full h-60 object-cover rounded-2xl shadow mb-4"
                style={{ minHeight: '25rem', maxHeight: '25rem' }}
              />
              {/* Title and badges */}
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">{modalFestival.name}</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="flex items-center gap-1 bg-slate-900 text-white px-3 py-1 rounded-full text-xs">
                  {modalFestival.location}
                </span>
                <span className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">
                  {modalFestival.date}
                </span>
                <span className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs">
                  {modalFestival.religion}
                </span>
                <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs">
                  {modalFestival.culture}
                </span>
              </div>
              {/* Long description full width with extra spacing below */}
              <div className="prose prose-slate max-w-none mb-1 w-full ">
                <ReactMarkdown>{modalFestival.longDescription || modalFestival.description}</ReactMarkdown>
              </div>
              {/* All other details below, left-aligned, with spacing */}
              <div className="w-full">
                {modalFestival.history && (
                  <div className="mb-4">
                    <div className="font-semibold mb-1">History:</div>
                    <div className="text-slate-600">{modalFestival.history}</div>
                  </div>
                )}
                {modalFestival.customs && (
                  <div className="mb-4">
                    <div className="font-semibold mb-1">Key Rituals:</div>
                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                      {modalFestival.customs.map((c, idx) => <li key={idx}>{c}</li>)}
                    </ul>
                  </div>
                )}
                {modalFestival.places && (
                  <div className="mb-4">
                    <div className="font-semibold mb-1">Significant Locations:</div>
                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                      {modalFestival.places.map((place, idx) => <li key={idx}>{place}</li>)}
                    </ul>
                  </div>
                )}
                {modalFestival.times && (
                  <div className="mb-4">
                    <div className="font-semibold mb-1">Typical Schedule:</div>
                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                      {modalFestival.times.map((t, idx) => <li key={idx}>{t}</li>)}
                    </ul>
                  </div>
                )}
                {modalFestival.highlights && modalFestival.highlights.length > 0 && (
                  <div className="mb-4">
                    <div className="font-semibold mb-1">Highlights:</div>
                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                      {modalFestival.highlights.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {modalFestival.schedule && (
                  <div className="mb-4">
                    <div className="font-semibold mb-1">Schedule:</div>
                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                      {modalFestival.schedule.map((item, idx) => (
                        <li key={idx}>{item.time} - {item.activity}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex gap-3 mt-4">
                  <button
                    className="px-6 py-2 rounded-full bg-blue-700 text-white font-semibold shadow hover:bg-blue-800 transition"
                    onClick={() => setModalFestival(null)}
                  >
                    Close
                  </button>
                  <Link
                    href="/festivals"
                    className="px-6 py-2 rounded-full bg-slate-900 text-white font-semibold shadow hover:bg-slate-800 transition"
                  >
                    All Festivals
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <style>
            {`
              .animate-fade-in-up {
                animation: fadeInUpModal 0.4s cubic-bezier(.39,.575,.565,1) both;
              }
              @keyframes fadeInUpModal {
                0% { opacity: 0; transform: translateY(40px);}
                100% { opacity: 1; transform: translateY(0);}
              }
            `}
          </style>
        </div>
      )}

      {/* Greeting Card Modal */}
      <GreetingCardModal open={showGreetingCard} onClose={() => setShowGreetingCard(false)} />

        <Footer />
    </>
  );
}

Festivals.layout = (page) => <Layout children={page} />;

export default Festivals;