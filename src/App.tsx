import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import SettingsModal from "./components/SettingsModal";
import MainCharacterSection from "./components/MainCharacterSection";
import SecondaryCharacterCard from "./components/SecondaryCharacterCard";
import Modal from "./components/Modal"; // if used for other UI elements

const App: React.FC = () => {
  // ---------------------------------------------------------
  // CHARACTER DATA LOADED FROM THE DATABASE
  // ---------------------------------------------------------
  const [characterData, setCharacterData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Settings modal state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Logo animation state
  const [logoKey, setLogoKey] = useState("logo-" + Date.now());
  const [logoAnimation, setLogoAnimation] = useState(true);
  const logoFallback = "/images/runefate-logo.png";

  // ---------------------------------------------------------
  // DEVICE CHECK (SOME VIDEO ASSETS DISABLED ON iOS)
  // ---------------------------------------------------------
  const [isIOS, setIsIOS] = useState(false);
  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));
  }, []);

  // ---------------------------------------------------------
  // LOAD CHARACTER PROFILE FROM API
  // ---------------------------------------------------------
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

  // ---------------------------------------------------------
  // RESET FUNCTION — YOU CAN EXPAND THIS IF NEEDED
  // ---------------------------------------------------------
  const handleReset = () => {
    // refresh logo animation
    setLogoKey("logo-" + Date.now());

    // reload DB character
    loadCharacterData();
  };

  // ---------------------------------------------------------
  // RENDER LOADING STATE
  // ---------------------------------------------------------
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black text-emerald-400 text-xl">
        Loading character...
      </div>
    );
  }

  // ---------------------------------------------------------
  // MAIN APP RENDER
  // ---------------------------------------------------------
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

      {/* MAIN CHARACTER SECTION */}
      <MainCharacterSection
        name={characterData?.name}
        image={characterData?.image}
      />

      {/* SECONDARY COMPANION CARD */}
      <SecondaryCharacterCard
        companionName={characterData?.companion_name}
        activeImage={characterData?.companion_image_active}
        inactiveImage={characterData?.companion_image_inactive}
      />

      {/* SETTINGS MODAL */}
      {isSettingsOpen && characterData && (
