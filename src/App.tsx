import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  validateAndReadImageFile,
  IMAGE_VALIDATION,
} from "./utils/fileValidation";
import { showError } from "./utils/notifications";
import { useCharacterState } from "./hooks/useCharacterState";
import { useAttackRolls } from "./hooks/useAttackRolls";
import { useLoadUserData } from "./hooks/useLocalStorage";
import { useIsIOS } from "./hooks/useDeviceDetection";
import {
  rangerActive,
  wolfActive,
  wolfInactive,
  logoAnimation,
  logoFallback,
  MAIN_CHARACTER_NAME,
  SECONDARY_CHARACTER_NAME,
} from "./constants";
import { MainCharacterSection } from "./components/MainCharacterSection";
import { SecondaryCharacterCard } from "./components/SecondaryCharacterCard";
import SettingsModal from "./components/SettingsModal";
import { AllCharactersPanel } from "./components/AllCharactersPanel";
import { AttackResultCard } from "./components/AttackResultCard";
import Header from "./components/Header";
import backgroundImage from "./assets/background.jpg";

export default function App() {
  const isIOS = useIsIOS();

  const {
    userName,
    setUserName,
    userAvatar,
    setUserAvatar,
    customBackground,
    setCustomBackground,
  } = useLoadUserData();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showAllCharactersPanel, setShowAllCharactersPanel] = useState(true);
  const [isAllCharactersPanelOpen, setIsAllCharactersPanelOpen] =
    useState(false);

  const {
    creatureAC,
    setCreatureAC,
    firstRound,
    setFirstRound,
    dreadfulStrike,
    setDreadfulStrike,
    huntersMark,
    setHuntersMark,
    zephyrStrike,
    setZephyrStrike,
    weapon,
    handleWeaponChange,
    secondaryActive,
    setSecondaryActive,
    logoKey,
    triggerLogoAnimation,
  } = useCharacterState();

  const {
    attackResultsMain,
    attackResultsSecondary,
    rollAll,
    clearResults,
    getAttackIcon,
    totalMain,
    totalSec,
  } = useAttackRolls({
    weapon,
    firstRound,
    huntersMark,
    zephyrStrike,
    dreadfulStrike,
    creatureAC,
    secondaryActive,
  });

  // 🎯 Skill Rolls
  const [initiative, setInitiative] = useState<number | null>(null);
  const [perception, setPerception] = useState<number | null>(null);
  const [stealth, setStealth] = useState<number | null>(null);
  const [history, setHistory] = useState<number | null>(null);

  const [glowInitiative, setGlowInitiative] = useState(false);
  const [glowPerception, setGlowPerception] = useState(false);
  const [glowStealth, setGlowStealth] = useState(false);
  const [glowHistory, setGlowHistory] = useState(false);
  const [critFlash, setCritFlash] = useState(false);

  // ♻️ Reset
  const handleReset = () => {
    setCreatureAC(15);
    setFirstRound(true);
    setDreadfulStrike(true);
    setHuntersMark(false);
    setZephyrStrike(false);
    handleWeaponChange("longbow");
    setSecondaryActive(true);
    clearResults();
    triggerLogoAnimation();

    setInitiative(null);
    setPerception(null);
    setStealth(null);
    setHistory(null);
  };

  // 🎲 Roll logic
  const rollD20 = (modifier: number): number => {
    const rawRoll = Math.floor(Math.random() * 20) + 1;
    const total = rawRoll + modifier;

    if (rawRoll === 20) {
      setCritFlash(true);
      setTimeout(() => setCritFlash(false), 600);
    }

    return total;
  };

  const handleRollAll = async () => {
  rollAll();
  triggerLogoAnimation();

  // 🎲 Roll all skill values
  const initRoll = rollD20(7);
  const percepRoll = rollD20(6);
  const stealthRoll = rollD20(10);
  const historyRoll = rollD20(1);

  setInitiative(initRoll);
  setPerception(percepRoll);
  setStealth(stealthRoll);
  setHistory(historyRoll);

  setGlowInitiative(true);
  setGlowPerception(true);
  setGlowStealth(true);
  setGlowHistory(true);

  setTimeout(() => {
    setGlowInitiative(false);
    setGlowPerception(false);
    setGlowStealth(false);
    setGlowHistory(false);
  }, 1000);

  // 🛰️ Send roll data to MU/TH/UR logger (dm.runefate.com)
  try {
    const timestamp = new Date().toISOString();

    // Collect attack roll results from existing logic
    const attacks = {
      "1ATK": attackResultsMain[0]
        ? { HIT: attackResultsMain[0].hitTotal, DM: attackResultsMain[0].total }
        : null,
      "2ATK": attackResultsMain[1]
        ? { HIT: attackResultsMain[1].hitTotal, DM: attackResultsMain[1].total }
        : null,
      "GSTK": attackResultsMain[2]
        ? { HIT: attackResultsMain[2].hitTotal, DM: attackResultsMain[2].total }
        : null,
      "SWRD": attackResultsMain[3]
        ? { HIT: attackResultsMain[3].hitTotal, DM: attackResultsMain[3].total }
        : null,
    };

    const koda = attackResultsSecondary[0]
      ? { BITE: { HIT: attackResultsSecondary[0].hitTotal, DM: attackResultsSecondary[0].total } }
      : null;

    await fetch("https://dm.runefate.com/.netlify/functions/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        character: MAIN_CHARACTER_NAME,
        timestamp,
        skills: {
          INIT: initRoll,
          PRCP: percepRoll,
          STLH: stealthRoll,
          HIST: historyRoll,
        },
        attacks,
        koda,
      }),
    });
  } catch (err) {
    console.error("Failed to send roll data to MU/TH/UR:", err);
  }
};

  // 🌄 Upload Background
  const handleUploadBackground = async (file: File) => {
    const result = await validateAndReadImageFile(
      file,
      IMAGE_VALIDATION.BACKGROUND
    );
    if (!result.success || !result.data) {
      showError(result.error || "Failed to upload image");
      return;
    }
    setCustomBackground(result.data);
    localStorage.setItem("customBackground", result.data);
  };

  const handleOpenAllCharacters = () => {
    if (showAllCharactersPanel) {
      setIsAllCharactersPanelOpen(true);
      setIsSettingsOpen(false);
    }
  };

  const characters = [
    { id: "main", name: MAIN_CHARACTER_NAME, photo: rangerActive, isActive: true },
    { id: "fang", name: SECONDARY_CHARACTER_NAME, photo: wolfActive, isActive: secondaryActive },
  ];

  const bgImage = customBackground || backgroundImage;

  return (
    <div
      className="min-h-screen p-4 md:p-6 text-white relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* HEADER */}
      <Header
        onReset={handleReset}
        isIOS={isIOS}
        logoKey={logoKey}
        logoAnimation={logoAnimation}
        logoFallback={logoFallback}
      />

      {/* 🧠 Skills Row (Hidden on iPhone, with fade-in animation) */}
      <div
        className="hidden sm:flex flex-wrap justify-end items-center gap-3 pr-6 mt-2
                   transition-all duration-500 ease-out"
      >
        {/* Initiative */}
        <div
          className={`text-green-400 font-bold text-lg border border-green-600/60 px-4 py-2 rounded-lg 
                      bg-transparent transform transition-all duration-500 ease-out
                      ${initiative !== null ? "opacity-100 scale-100" : "opacity-0 scale-90"}
                      ${glowInitiative ? "shadow-[0_0_12px_rgba(34,197,94,0.6)]" : ""}`}
        >
          Initiative: {initiative ?? "--"}
        </div>

        {/* Perception */}
        <div
          className={`text-blue-200 font-bold text-lg border border-[#203596]/80 px-4 py-2 rounded-lg 
                      bg-transparent transform transition-all duration-500 ease-out
                      ${perception !== null ? "opacity-100 scale-100" : "opacity-0 scale-90"}
                      ${glowPerception ? "shadow-[0_0_12px_rgba(32,53,150,0.8)]" : ""}`}
        >
          Perception: {perception ?? "--"}
        </div>

        {/* Stealth */}
        <div
          className={`text-purple-300 font-bold text-lg border border-[#53188e]/80 px-4 py-2 rounded-lg 
                      bg-transparent transform transition-all duration-500 ease-out
                      ${stealth !== null ? "opacity-100 scale-100" : "opacity-0 scale-90"}
                      ${glowStealth ? "shadow-[0_0_12px_rgba(83,24,142,0.8)]" : ""}`}
        >
          Stealth: {stealth ?? "--"}
        </div>

        {/* History */}
        <div
          className={`text-amber-300 font-bold text-lg border border-[#7e3110]/80 px-4 py-2 rounded-lg 
                      bg-transparent transform transition-all duration-500 ease-out
                      ${history !== null ? "opacity-100 scale-100" : "opacity-0 scale-90"}
                      ${glowHistory ? "shadow-[0_0_12px_rgba(126,49,16,0.8)]" : ""}`}
        >
          History: {history ?? "--"}
        </div>
      </div>

      {/* 🎲 ROLL BUTTON */}
      <div className="flex justify-center my-6 relative">
        <button
          onClick={handleRollAll}
          className="relative overflow-hidden px-10 py-2 text-lg font-bold rounded-full text-white
                     bg-gradient-to-r from-green-700 via-green-600 to-green-500
                     shadow-[0_0_15px_rgba(34,197,94,0.6)]
                     hover:shadow-[0_0_25px_rgba(34,197,94,0.9)]
                     transition-all duration-300 hover:scale-105"
        >
          Roll
          <span className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-transparent opacity-0 hover:opacity-100 blur-lg"></span>
        </button>

        {critFlash && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[200px] h-[60px] rounded-full bg-gradient-to-r from-yellow-400 via-white to-yellow-400 opacity-70 blur-md animate-ping" />
          </div>
        )}
      </div>

      {/* MAIN CONTENT */}
      <div className="space-y-4 xl:grid xl:grid-cols-[400px_1fr] xl:gap-4 xl:space-y-0 mx-auto">
        <div className="xl:row-start-1 xl:col-start-1 text-xs md:text-sm leading-tight">
          <MainCharacterSection
            mainName={MAIN_CHARACTER_NAME}
            mainPhoto={rangerActive}
            firstRound={firstRound}
            setFirstRound={setFirstRound}
            dreadfulStrike={dreadfulStrike}
            setDreadfulStrike={setDreadfulStrike}
            huntersMark={huntersMark}
            setHuntersMark={setHuntersMark}
            zephyrStrike={zephyrStrike}
            setZephyrStrike={setZephyrStrike}
            handleWeaponChange={handleWeaponChange}
            weapon={weapon}
            totalDamage={attackResultsMain.length > 0 ? totalMain : undefined}
          />
        </div>

        <div className="xl:row-start-1 xl:col-start-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {attackResultsMain.map((r, i) => (
              <AttackResultCard
                key={`main-${i}`}
                {...r}
                icon={getAttackIcon(r.label)}
              />
            ))}
          </div>
        </div>

        <div className="xl:row-start-2 xl:col-start-1">
          <SecondaryCharacterCard
            name={SECONDARY_CHARACTER_NAME}
            photo={wolfActive}
            photoInactive={wolfInactive}
            isActive={secondaryActive}
            onClick={() => setSecondaryActive(!secondaryActive)}
            totalDamage={
              attackResultsSecondary.length > 0 ? totalSec : undefined
            }
          />
        </div>

        {attackResultsSecondary.length > 0 && (
          <div className="xl:row-start-2 xl:col-start-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {attackResultsSecondary.map((r, i) => (
                <AttackResultCard
                  key={`secondary-${i}`}
                  {...r}
                  icon={getAttackIcon(r.label)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <ToastContainer
        position="top-center"
        theme="colored"
        autoClose={3000}
        closeOnClick
        pauseOnHover
        draggable
        toastClassName="!rounded-xl"
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userName={userName}
        setUserName={setUserName}
        userAvatar={userAvatar}
        setUserAvatar={setUserAvatar}
        onUploadBackground={handleUploadBackground}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        showAllCharactersPanel={showAllCharactersPanel}
        setShowAllCharactersPanel={setShowAllCharactersPanel}
        onOpenAllCharacters={handleOpenAllCharacters}
      />

      {showAllCharactersPanel && (
        <AllCharactersPanel
          characters={characters}
          onToggleCharacter={(id) => {
            if (id === "fang") setSecondaryActive(!secondaryActive);
          }}
          isOpen={isAllCharactersPanelOpen}
          onClose={() => setIsAllCharactersPanelOpen(false)}
        />
      )}
    </div>
  );
}
