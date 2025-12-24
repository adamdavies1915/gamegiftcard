"use client";

import { useState } from "react";
import GiftCard from "./components/GiftCard";
import { GameData } from "./api/types";

type StoreType = "steam" | "epic" | "microsoft" | null;

interface ParsedUrl {
  store: StoreType;
  id: string;
}

function parseGameUrl(url: string): ParsedUrl | null {
  // Steam: https://store.steampowered.com/app/1245620/ELDEN_RING/
  const steamMatch = url.match(/store\.steampowered\.com\/app\/(\d+)/);
  if (steamMatch) {
    return { store: "steam", id: steamMatch[1] };
  }

  // Epic Games: https://store.epicgames.com/en-US/p/elden-ring
  const epicMatch = url.match(/store\.epicgames\.com\/[a-z-]+\/p\/([a-z0-9-]+)/i);
  if (epicMatch) {
    return { store: "epic", id: epicMatch[1] };
  }

  // Microsoft/Xbox: https://www.xbox.com/en-US/games/store/game-name/9NBLGGH5Z0F8
  // or https://www.microsoft.com/en-us/p/game-name/9NBLGGH5Z0F8
  const xboxMatch = url.match(/xbox\.com\/[a-z-]+\/games\/store\/[^/]+\/([A-Z0-9]+)/i);
  if (xboxMatch) {
    return { store: "microsoft", id: xboxMatch[1] };
  }

  const msMatch = url.match(/microsoft\.com\/[a-z-]+\/p\/[^/]+\/([A-Z0-9]+)/i);
  if (msMatch) {
    return { store: "microsoft", id: msMatch[1] };
  }

  return null;
}

function getStoreName(store: StoreType): string {
  switch (store) {
    case "steam": return "Steam";
    case "epic": return "Epic Games";
    case "microsoft": return "Xbox/Microsoft";
    default: return "";
  }
}

export default function Home() {
  const [gameUrl, setGameUrl] = useState("");
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [toName, setToName] = useState("");
  const [fromName, setFromName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetchGame = async () => {
    setError("");
    setGameData(null);

    const parsed = parseGameUrl(gameUrl);
    if (!parsed) {
      setError("Invalid URL. Supported stores: Steam, Epic Games, Xbox/Microsoft Store");
      return;
    }

    setLoading(true);
    try {
      let apiUrl = "";
      switch (parsed.store) {
        case "steam":
          apiUrl = `/api/steam?appId=${parsed.id}`;
          break;
        case "epic":
          apiUrl = `/api/epic?slug=${parsed.id}`;
          break;
        case "microsoft":
          apiUrl = `/api/microsoft?productId=${parsed.id}`;
          break;
      }

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || `Failed to fetch from ${getStoreName(parsed.store)}`);
        return;
      }

      setGameData(data);
    } catch {
      setError("Failed to fetch game data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-[#F0F0F0] p-8">
      {/* Header - Hidden when printing */}
      <div className="no-print max-w-2xl mx-auto mb-8">
        <h1 className="font-black text-4xl md:text-5xl uppercase tracking-tight mb-2 text-black">
          Game Gift Card
        </h1>
        <p className="font-bold text-lg text-gray-700 border-l-4 border-black pl-3">
          Generator
        </p>
      </div>

      {/* Input Form - Hidden when printing */}
      <div className="no-print max-w-2xl mx-auto mb-8 bg-white border-[4px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="space-y-4">
          {/* Store URL Input */}
          <div>
            <label className="font-black text-sm uppercase block mb-2">
              Game Store URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={gameUrl}
                onChange={(e) => setGameUrl(e.target.value)}
                placeholder="Paste Steam, Epic, or Xbox store URL..."
                className="flex-1 border-[3px] border-black p-3 font-medium text-black placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-[#66C0F4]"
              />
              <button
                onClick={handleFetchGame}
                disabled={loading || !gameUrl}
                className="bg-[#66C0F4] border-[3px] border-black px-6 py-3 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "..." : "Fetch"}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 font-medium">
              Supports: Steam, Epic Games Store, Xbox/Microsoft Store
            </p>
          </div>

          {error && (
            <div className="bg-[#FF6B6B] border-[3px] border-black p-3">
              <p className="font-bold text-black">{error}</p>
            </div>
          )}

          {/* Personalization Fields - Only show when game is loaded */}
          {gameData && (
            <div className="space-y-4 pt-4 border-t-[3px] border-black">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-black text-sm uppercase block mb-2">
                    To
                  </label>
                  <input
                    type="text"
                    value={toName}
                    onChange={(e) => setToName(e.target.value)}
                    placeholder="Recipient's name"
                    className="w-full border-[3px] border-black p-3 font-medium text-black placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-[#FFE66D]"
                  />
                </div>
                <div>
                  <label className="font-black text-sm uppercase block mb-2">
                    From
                  </label>
                  <input
                    type="text"
                    value={fromName}
                    onChange={(e) => setFromName(e.target.value)}
                    placeholder="Your name"
                    className="w-full border-[3px] border-black p-3 font-medium text-black placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-[#4ECDC4]"
                  />
                </div>
              </div>
              <div>
                <label className="font-black text-sm uppercase block mb-2">
                  Personal Message (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a personal message..."
                  rows={3}
                  className="w-full border-[3px] border-black p-3 font-medium text-black placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-[#FF6B6B] resize-none"
                />
              </div>
              <button
                onClick={handlePrint}
                className="w-full bg-[#1B2838] text-[#66C0F4] border-[3px] border-black px-6 py-4 font-black uppercase text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                Print Gift Card
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Gift Card Preview */}
      {gameData && (
        <div className="print-area">
          <p className="no-print text-center font-black text-sm uppercase text-gray-500 mb-4">
            Preview
          </p>
          <GiftCard
            game={gameData}
            toName={toName}
            fromName={fromName}
            message={message}
          />
        </div>
      )}

      {/* Floating Print Button */}
      {gameData && (
        <button
          onClick={handlePrint}
          className="no-print fixed bottom-8 right-8 bg-[#FF6B6B] text-black border-[4px] border-black p-4 font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all flex items-center gap-3 text-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print
        </button>
      )}
    </main>
  );
}
