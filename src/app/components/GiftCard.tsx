"use client";

import { GameData } from "../api/types";

interface GiftCardProps {
  game: GameData;
  toName: string;
  fromName: string;
  message: string;
}

const storeConfig = {
  steam: {
    name: "Steam",
    headerBg: "#1B2838",
    accentColor: "#66C0F4",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10c-4.6 0-8.45-3.08-9.64-7.27l3.83 1.58a2.84 2.84 0 0 0 2.78 2.27c1.56 0 2.83-1.27 2.83-2.83v-.13l3.4-2.43h.08c2.08 0 3.77-1.69 3.77-3.77s-1.69-3.77-3.77-3.77-3.77 1.69-3.77 3.77v.05l-2.37 3.46-.16-.01c-.55 0-1.06.16-1.49.43L2 11.46A10 10 0 0 1 12 2z"/>
      </svg>
    ),
  },
  epic: {
    name: "Epic Games",
    headerBg: "#121212",
    accentColor: "#FFFFFF",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M3.537 0C2.165 0 1.66.506 1.66 1.879V18.44a4.262 4.262 0 0 0 .04.628c.118.95.395 1.283 1.118 1.628l6.59 3.017.087.039c.205.08.407.123.605.13h.06c.2-.007.403-.05.608-.13l.087-.04 6.59-3.016c.724-.345 1-.678 1.118-1.628.027-.206.04-.416.04-.628V1.879C18.603.506 18.098 0 16.726 0H3.537zm2.065 4.166h2.948v7.652c0 1.263-.653 1.91-1.816 1.91-.41 0-.893-.078-1.132-.178v-1.406c.193.059.46.098.716.098.496 0 .724-.237.724-.835V4.166zm7.727 0c1.657 0 2.677 1.263 2.677 3.173 0 1.95-1.04 3.173-2.677 3.173h-1.597V4.166h1.597zm.04 1.295h-.637v3.756h.637c.813 0 1.31-.676 1.31-1.878 0-1.202-.497-1.878-1.31-1.878z"/>
      </svg>
    ),
  },
  microsoft: {
    name: "Xbox",
    headerBg: "#107C10",
    accentColor: "#FFFFFF",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M4.102 21.033A11.947 11.947 0 0 0 12 24a11.96 11.96 0 0 0 7.902-2.967c1.877-1.912-4.316-8.709-7.902-11.417-3.582 2.708-9.779 9.505-7.898 11.417zm11.16-14.406c2.5 2.961 7.484 9.578 6.648 12.14A11.942 11.942 0 0 0 24 12c0-6.627-5.373-12-12-12a11.93 11.93 0 0 0-6.895 2.188c.773-.035 4.469-.09 10.057 4.439zM2.09 18.767c-.836-2.562 4.148-9.179 6.648-12.14 5.588-4.529 9.284-4.474 10.057-4.439A11.93 11.93 0 0 0 12 0C5.373 0 0 5.373 0 12c0 2.46.744 4.746 2.09 6.767z"/>
      </svg>
    ),
  },
};

export default function GiftCard({
  game,
  toName,
  fromName,
  message,
}: GiftCardProps) {
  // Always use Steam branding for now
  const config = storeConfig.steam;

  return (
    <div className="gift-card bg-[#FFFEF0] border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-2xl mx-auto">
      {/* Header Banner */}
      <div
        className="border-b-[4px] border-black p-4"
        style={{ backgroundColor: config.headerBg }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 border-[3px] border-black flex items-center justify-center"
            style={{ backgroundColor: config.accentColor, color: config.headerBg }}
          >
            {config.icon}
          </div>
          <h1
            className="font-black text-2xl tracking-tight uppercase"
            style={{ color: config.accentColor }}
          >
            {config.name} Game
          </h1>
        </div>
      </div>

      {/* Game Image */}
      <div className="border-b-[4px] border-black">
        <img
          src={game.headerImage}
          alt={game.name}
          className="w-full h-auto block"
        />
      </div>

      {/* Game Title */}
      <div className="bg-[#FF6B6B] border-b-[4px] border-black p-4">
        <h2 className="font-black text-3xl text-black uppercase tracking-tight leading-tight">
          {game.name}
        </h2>
      </div>

      {/* Gift Details */}
      <div className="p-6 space-y-4">
        {/* To/From Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#FFE66D] border-[3px] border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="font-black text-sm uppercase block mb-1">To:</span>
            <span className="font-bold text-xl block truncate">
              {toName || "_______________"}
            </span>
          </div>
          <div className="bg-[#4ECDC4] border-[3px] border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="font-black text-sm uppercase block mb-1">From:</span>
            <span className="font-bold text-xl block truncate">
              {fromName || "_______________"}
            </span>
          </div>
        </div>

        {/* Personal Message */}
        {message && (
          <div className="bg-white border-[3px] border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="font-black text-sm uppercase block mb-2">
              Message:
            </span>
            <p className="font-medium text-lg italic">&ldquo;{message}&rdquo;</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-black p-3">
        <p className="text-white font-black text-xs text-center uppercase tracking-widest">
          Happy Gaming!
        </p>
      </div>
    </div>
  );
}
