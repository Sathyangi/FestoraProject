import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';

const defaultWishes = {
  'Vesak Poya': 'May the light of the Buddha illuminate your life with peace and happiness on this Vesak Poya!',
  'Poson Poya': 'On this sacred Poson Poya, may the teachings of the Dhamma guide you to enlightenment and serenity.',
  'Kathina Pinkama': 'May the merit of your generous offerings during this Kathina Pinkama bring you immense joy and blessings.',
  'Thai Pongal': 'Happy Thai Pongal! May this festival bring you abundance, prosperity, and happiness.',
  'Maha Shivaratri': 'May the divine blessings of Lord Shiva be with you on this auspicious Maha Shivaratri.',
  'Deepavali (Diwali)': 'Wishing you a bright and joyous Deepavali filled with light, happiness, and prosperity!',
  'Navarathri': 'May the divine goddesses Durga, Lakshmi, and Saraswathy bless you with strength, wealth, and knowledge during Navarathri.',
  'Eid al-Fitr (Ramazan Festival)': 'Eid Mubarak! May Allah accept your fasts and prayers, and shower you with blessings.',
  'Eid al-Adha (Hajj Festival / Festival of Sacrifice)': 'Eid al-Adha Mubarak! May your devotion and sacrifices be accepted by Allah.',
  'Mawlid al-Nabi (Milad-un-Nabi)': 'Happy Mawlid al-Nabi! May the teachings of Prophet Muhammad inspire peace and goodwill in your heart.',
  'Christmas': 'Merry Christmas! May the joy and peace of the season be with you and your loved ones.',
  'Easter': 'Happy Easter! May the hope and renewal of Easter fill your life with joy.',
  'Good Friday': 'Reflecting on the sacrifice of Good Friday and praying for peace and understanding.',
  'Feast of Our Lady of Madhu': 'May Our Lady of Madhu shower her blessings upon you and your family.',
  'Sinhala & Tamil New Year (Avurudu)': 'Subha Aluth Avuruddak / Puthandu Nalvazhthukkal! Wishing you a happy and prosperous New Year!',
  'Kataragama Festival (Religious Observances)': 'May the blessings of God Kataragama be with you during this sacred festival.',
};

const cardTemplates = {
  default: ({ festival, wish, fromName, toName, customMessage, backgroundImageUrl }) => (
    <div
      className="greeting-card default-template"
      style={{
        backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: backgroundImageUrl ? 'white' : 'inherit',
        textShadow: backgroundImageUrl ? '1px 1px 3px rgba(0, 0, 0, 0.7)' : 'none',
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      }}
    >
      <h3 className="festival-name">{festival}</h3>
      <p className="wish">{wish}</p>
      {customMessage && <p className="custom-message">{customMessage}</p>}
      <div className="signatures">
        {toName && <p>To: {toName}</p>}
        {fromName && <p>From: {fromName}</p>}
      </div>
    </div>
  ),
  vibrant: ({ festival, wish, fromName, toName, customMessage }) => (
    <div
      className="rounded-4 text-white p-4 text-center"
      style={{
        background: 'radial-gradient(circle at 30% 20%, #FFD54F 0%, #FF7043 35%, #7E57C2 70%, #283593 100%)',
        minHeight: '320px',
        boxShadow: '0 0 25px rgba(0, 0, 0, 0.4)',
        fontFamily: '"Comic Sans MS", cursive, sans-serif'
      }}
    >
      <h3 style={{ fontSize: '2.3rem' }}>{festival} 🎊</h3>
      <p className="fs-5">{wish}</p>
      {customMessage && <p className="fst-italic text-light">{customMessage}</p>}
      <hr className="bg-white opacity-50" />
      <p className="mt-3">💌 <strong>To:</strong> {toName}</p>
      <p>🖊️ <strong>From:</strong> {fromName}</p>
    </div>
  ),
  premium: ({ festival, wish, fromName, toName, customMessage }) => (
    <div
      className="p-4 text-white text-center rounded-4"
      style={{
        background: 'linear-gradient(135deg, #F3E5F5 0%, #CE93D8 35%, #8E24AA 80%)',
        minHeight: '320px',
        border: '2px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 0 35px rgba(255, 255, 255, 0.2)',
        fontFamily: "'Georgia', serif"
      }}
    >
      <h3 className="display-6">{festival} ✨</h3>
      <p className="fs-5">{wish}</p>
      {customMessage && <p className="fst-italic text-light">{customMessage}</p>}
      <hr className="bg-light opacity-50" />
      <p className="mt-3">📩 <strong>To:</strong> {toName}</p>
      <p>📬 <strong>From:</strong> {fromName}</p>
    </div>
  ),
  minimalist: ({ festival, wish, fromName, toName, customMessage }) => (
    <div
      className="border rounded-4 p-4 text-center shadow-lg bg-white"
      style={{
        minHeight: '300px',
        fontFamily: "'Segoe UI', sans-serif"
      }}
    >
      <h3 style={{ color: '#FF5722', fontWeight: 'bold' }}>{festival}</h3>
      <p className="text-muted fs-5">{wish}</p>
      {customMessage && (
        <p className="fst-italic" style={{ color: '#607D8B' }}>
          {customMessage}
        </p>
      )}
      <hr />
      <p className="mt-3"><strong>👤 To:</strong> {toName}</p>
      <p><strong>✍️ From:</strong> {fromName}</p>
    </div>
  ),
};

export default function GreetingCardModal({ open, onClose }) {
  const [selectedFestival, setSelectedFestival] = useState('');
  const [wish, setWish] = useState('');
  const [fromName, setFromName] = useState('');
  const [toName, setToName] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [currentTemplate, setCurrentTemplate] = useState('default');
  const [backgroundImageUrl, setBackgroundImageUrl] = useState('');
  const cardRef = useRef(null);

  useEffect(() => {
    if (selectedFestival) setWish(defaultWishes[selectedFestival] || '');
  }, [selectedFestival]);

  if (!open) return null;

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) setBackgroundImageUrl(URL.createObjectURL(file));
  };

  const handleDownloadCard = () => {
    if (cardRef.current) {
      html2canvas(cardRef.current, { scale: 2, useCORS: true }).then(canvas => {
        const link = document.createElement('a');
        link.download = `greeting_card.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  };

  const CurrentCardTemplate = cardTemplates[currentTemplate] || cardTemplates.default;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full mx-4 relative p-8">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Create Your Greeting Card</h2>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Controls */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="block font-semibold mb-1">Select Festival:</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={selectedFestival}
                onChange={e => setSelectedFestival(e.target.value)}
              >
                <option value="">-- Select a Festival --</option>
                {Object.keys(defaultWishes).map(festival => (
                  <option key={festival} value={festival}>{festival}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Template:</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={currentTemplate}
                onChange={e => setCurrentTemplate(e.target.value)}
              >
                <option value="default">Default</option>
                <option value="vibrant">Vibrant</option>
                <option value="premium">Premium</option>
                <option value="minimalist">Minimalist</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Greeting Message:</label>
              <textarea
                className="w-full border rounded px-3 py-2"
                rows={2}
                value={wish}
                onChange={e => setWish(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">To:</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={toName}
                onChange={e => setToName(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">From:</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={fromName}
                onChange={e => setFromName(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Additional Message:</label>
              <textarea
                className="w-full border rounded px-3 py-2"
                rows={2}
                value={customMessage}
                onChange={e => setCustomMessage(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Background Image (optional):</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} />
            </div>
          </div>
          {/* Preview */}
          <div className="flex-1 flex flex-col items-center">
            <div ref={cardRef} className="w-full max-w-xs mb-4">
              <CurrentCardTemplate
                festival={selectedFestival}
                wish={wish}
                fromName={fromName}
                toName={toName}
                customMessage={customMessage}
                backgroundImageUrl={backgroundImageUrl}
              />
            </div>
            <button
              className="px-4 py-2 rounded bg-blue-700 text-white font-semibold shadow hover:bg-blue-800 transition"
              onClick={handleDownloadCard}
            >
              Download Card (PNG)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}