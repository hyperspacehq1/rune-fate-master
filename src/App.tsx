import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import SettingsModal from "./components/SettingsModal";
import MainCharacterSection from "./components/MainCharacterSection";
import SecondaryCharacterCard from "./components/SecondaryCharacterCard";

const App: React.FC = () => {
  // CHARACTER LOADING
  const [characterData, setCharacterData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // SETTINGS MODAL
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // LOGO ANIMATION
  const [logoKey, setLogoKey] = useState("logo-" + Date.now());
  const [logoAnimation, setLogoAnimation] = useState(true);
  const logoFallback = "/images/runefate-logo.png";

  // iOS CHECK
  const [isIOS, setIsIOS] = useState(false);
  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));
  }, []);

  // LOAD CHARACTER FROM API
  const loadCharacterData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/get-character");
      const json = await response.json();
      setCharacterData(json.character);
      setLoading(false);
    } catch (err) {
      console.error("Error loading character:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCharacterData();
  }, []);

  // RESET HANDLER
  const handleReset = () => {
    setLogoKey("logo-" + Date.now());
    loadCharacterData();
  };

  // LOADING SCREEN
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black text-emerald-400 text-xl">
        Loading character...
      </div>
    );
  }

  // MAIN APP
  return (
    <div className="min-h-screen bg-black text-white">

      {/* HEADER */}
      <Header
        onReset={handleReset}
        setSettingsOpen={setIsSettingsOpen}
        isIOS={isIOS}
        logoKey={logoKey}
        logoAnimation={logoAnimation}
        logoFallback={logoFallback}
      />

      {/* MAIN CHARACTER */}
      <MainCharacterSection
        name={characterData?.name}
        image={characterData?.image}
      />

      {/* COMPANION CARD */}
      <SecondaryCharacterCard
        companionName={characterData?.companion_name}
        activeImage={characterData?.companion_image_active}
        inactiveImage={characterData?.companion_image_inactive}
      />

      {/* SETTINGS MODAL */}
      {isSettingsOpen && characterData && (
        <SettingsModal
          onClose={() => setIsSettingsOpen(false)}
          current={characterData}
          onSaved={loadCharacterData}
        />
      )}

    </div>
  );
};

export default App;
