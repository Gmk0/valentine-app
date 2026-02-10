"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [yesScale, setYesScale] = useState(1);
  const [noCount, setNoCount] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [tempName, setTempName] = useState("");
  const [isNameSet, setIsNameSet] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const noPhrases = [
    "Non 💔",
    "Tu es sûre ?",
    "Vraiment sûre ?",
    "Pense à nous...",
    "Ne fais pas ça !",
    "Je vais pleurer...",
    "Tu me brises le cœur 💔",
    "Je suis très triste...",
    "Pitié...",
    "Bon, d'accord...",
    "Je plaisante, dis oui !",
    "S'il te plaît ❤️",
  ];

  useEffect(() => {
    setMounted(true);
    const savedScale = localStorage.getItem("valentine_scale");
    const savedName = localStorage.getItem("valentine_name");

    if (savedScale) {
      setYesScale(parseFloat(savedScale));
    }
    if (savedName) {
      setName(savedName);
      setIsNameSet(true);
    }
  }, []);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      const finalName = tempName.trim();
      setName(finalName);
      setIsNameSet(true);
      localStorage.setItem("valentine_name", finalName);
    }
  };

  const handleNoClick = () => {
    const newScale = yesScale * 1.3;
    setYesScale(newScale);
    setNoCount(noCount + 1);
    localStorage.setItem("valentine_scale", newScale.toString());
  };

  const handleYesClick = async () => {
    setAccepted(true);
    localStorage.removeItem("valentine_scale");

    // Send data to backend -> n8n
    try {
      await fetch('/api/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name || "Unknown",
          accepted: true,
          noCount: noCount,
        }),
      });
    } catch (e) {
      console.error("Failed to send response", e);
    }
  };

  const handleReset = () => {
    setYesScale(1);
    setNoCount(0);
    localStorage.removeItem("valentine_scale");
    // Optional: Keep name or reset it? Let's keep it for now unless explicitly cleared
    // localStorage.removeItem("valentine_name"); 
    setAccepted(false);
  };

  const handleFullReset = () => {
    handleReset();
    localStorage.removeItem("valentine_name");
    setName("");
    setIsNameSet(false);
    setTempName("");
  }

  // Get the current "No" button text
  const noText = noPhrases[Math.min(noCount, noPhrases.length - 1)];

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pink-50">
        <div className="text-4xl animate-pulse">❤️</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-brand-secondary to-pink-200 overflow-hidden relative">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-brand-primary/20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 4 + 1}rem`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 2}s`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          >
            ❤️
          </div>
        ))}
      </div>

      <div className="z-10 flex flex-col items-center text-center p-4 w-full max-w-4xl">
        {!isNameSet ? (
          // Name Input View
          <form onSubmit={handleNameSubmit} className="flex flex-col items-center gap-6 animate-fade-in bg-white/50 p-8 rounded-2xl shadow-xl backdrop-blur-sm border border-brand-secondary/30">
            <div className="text-4xl mb-2">💌</div>
            <h2 className="text-2xl md:text-3xl font-bold text-brand-primary">
              Une petite question pour commencer...
            </h2>
            <label htmlFor="nameInput" className="text-lg text-gray-700">
              Comment t'appelles-tu ?
            </label>
            <input
              id="nameInput"
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="w-full max-w-xs px-4 py-3 rounded-xl border-2 border-brand-secondary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all text-center text-xl text-brand-primary placeholder:text-brand-secondary/50 bg-white"
              placeholder="Ton prénom..."
              autoFocus
            />
            <button
              type="submit"
              disabled={!tempName.trim()}
              className="bg-brand-primary hover:bg-brand-accent text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
            >
              Continuer ❤️
            </button>
          </form>
        ) : accepted ? (
          <div className="animate-bounce flex flex-col items-center gap-8 px-4">
            <h1 className="text-3xl md:text-6xl font-bold text-brand-primary drop-shadow-md leading-tight">
              Super {name} ! ❤️ <br />
              <span className="text-2xl md:text-4xl block mt-4 text-brand-secondary-dark">
                Je récupère tes coordonnées, je t'envoie un message tout de suite ! 📱
              </span>
            </h1>
            <div className="text-8xl mt-4 animate-pulse">🥰</div>
            <button
              onClick={handleFullReset}
              className="mt-12 text-sm text-brand-accent underline hover:text-brand-primary opacity-60 hover:opacity-100 transition-opacity"
            >
              Recommencer du début
            </button>
          </div>
        ) : (
          <>
            <div className="mb-12 relative group pointer-events-none">
              <svg
                width="120"
                height="120"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-brand-primary animate-pulse mx-auto drop-shadow-xl transform group-hover:scale-110 transition-transform duration-300"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-brand-primary mb-16 drop-shadow-sm max-w-3xl leading-tight tracking-tight">
              Veux-tu être ma Valentine, {name} ?
            </h1>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full relative h-32">
              <button
                onClick={handleYesClick}
                style={{
                  transform: `scale(${yesScale})`,
                  fontSize: `${Math.min(20 + yesScale * 2, 60)}px`, // Cap font size
                }}
                className="bg-brand-primary hover:bg-brand-accent text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-200 active:scale-95 whitespace-nowrap z-20"
              >
                Oui ❤️
              </button>

              <button
                onClick={handleNoClick}
                className="bg-white text-gray-800 hover:bg-gray-100 font-bold py-3 px-8 rounded-full shadow-lg text-xl transition-all duration-200 hover:rotate-6 active:rotate-12 border-2 border-transparent hover:border-brand-secondary z-10 whitespace-nowrap select-none min-w-[150px]"
              >
                {noText}
              </button>
            </div>

            {noCount > 0 && (
              <div className="h-4"></div> /* Spacer */
            )}

            <button
              onClick={handleFullReset}
              className="fixed bottom-4 right-4 text-xs text-brand-accent/30 hover:text-brand-accent underline"
            >
              Reset
            </button>
          </>
        )}
      </div>
    </div>
  );
}
