import { useState } from 'react';
import { Icon } from '@iconify/react';

interface HomeProps {
  onStartReading: (cardCount: 1 | 3, skipMeditation: boolean) => void;
  onViewGallery: () => void;
}

export default function Home({ onStartReading, onViewGallery }: HomeProps) {
  const [cardCount, setCardCount] = useState<1 | 3>(3);
  const [skipMeditation, setSkipMeditation] = useState(false);

  return (
    <main className="relative overflow-hidden" role="main">
      {/* Moon glow effect */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      
      <div className="relative z-10 container mr-auto ml-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen max-w-4xl">
        {/* Title */}
        <header className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-3 tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-blue-200 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Lunar Arcanum Tarot
            </span>
          </h1>
          <p className="text-blue-300/80 text-base md:text-lg tracking-wide">
            of Teyvat
          </p>
        </header>
        
        {/* Mystique text */}
        <section className="max-w-3xl text-center space-y-5 mb-12" aria-label="About Lunar Arcanum">
          <p className="text-blue-100/90 text-base md:text-lg leading-relaxed">
            Step into a world where the threads of fate intertwine with the elements, and the whispers of gods and mortals echo across countless realms. 
            Here, the Lunar Arcanum Tarot brings the mysteries of Teyvat to your fingertips, offering guidance, insight, and reflection through the symbolic lens of the 22 major Arcana.
          </p>
          
          <p className="text-blue-200/80 text-sm md:text-base leading-relaxed">
            Each card holds a fragment of the world's hidden truths: from the radiant light of the Sun to the shadowed tides of the Moon, 
            from the quiet contemplation of the Hermit to the sudden upheaval of the Tower. These cards do not merely predict—they <em className="text-cyan-300 font-semibold">illuminate</em> the choices, 
            challenges, and connections that shape your journey.
          </p>
          
          <p className="text-blue-200/70 text-sm md:text-base leading-relaxed">
            Through single-card insights, multi-card spreads, or yes/no questions, you will explore your path in love, family, and work, 
            guided by the wisdom encoded in the Lunar Arcanum.
          </p>
          
          <p className="text-blue-300/90 text-base md:text-lg leading-relaxed italic font-medium">
            Embrace the magic, the mysteries, and the stories woven into the Arcanum. 
            Let the light of the stars, the currents of the elements, and the voices of the past guide your destiny.
          </p>
        </section>

        {/* Reading controls */}
        <section className="w-full max-w-2xl space-y-6" aria-label="Reading options">
          {/* Reading type selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ${
                cardCount === 1
                  ? 'bg-gradient-to-br from-blue-600 to-cyan-600 shadow-xl shadow-blue-500/30 scale-105'
                  : 'bg-slate-900/40 border border-blue-500/30 hover:border-blue-400/50 hover:bg-slate-900/60'
              }`}
              onClick={() => setCardCount(1)}
              aria-label="Select single card reading for yes or no questions"
              aria-pressed={cardCount === 1}
            >
              <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                <Icon 
                  icon="mdi:cards-playing-outline" 
                  className={`text-4xl ${cardCount === 1 ? 'text-white' : 'text-blue-300'}`}
                />
                <div>
                  <div className={`text-lg font-bold ${cardCount === 1 ? 'text-white' : 'text-blue-200'}`}>
                    Single Card
                  </div>
                  <div className={`text-xs mt-1 ${cardCount === 1 ? 'text-blue-100' : 'text-blue-400'}`}>
                    Yes or No Question
                  </div>
                </div>
              </div>
              {cardCount === 1 && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
              )}
            </button>

            <button
              className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ${
                cardCount === 3
                  ? 'bg-gradient-to-br from-blue-600 to-cyan-600 shadow-xl shadow-blue-500/30 scale-105'
                  : 'bg-slate-900/40 border border-blue-500/30 hover:border-blue-400/50 hover:bg-slate-900/60'
              }`}
              onClick={() => setCardCount(3)}
              aria-label="Select three card spread for past, present, and future"
              aria-pressed={cardCount === 3}
            >
              <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                <Icon 
                  icon="mdi:cards-playing" 
                  className={`text-4xl ${cardCount === 3 ? 'text-white' : 'text-blue-300'}`}
                />
                <div>
                  <div className={`text-lg font-bold ${cardCount === 3 ? 'text-white' : 'text-blue-200'}`}>
                    Three Card Spread
                  </div>
                  <div className={`text-xs mt-1 ${cardCount === 3 ? 'text-blue-100' : 'text-blue-400'}`}>
                    Past, Present, Future
                  </div>
                </div>
              </div>
              {cardCount === 3 && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
              )}
            </button>
          </div>

          {/* Skip meditation checkbox */}
          <div className="mb-4">
            <label className="inline-flex items-center gap-3 cursor-pointer bg-slate-900/40 backdrop-blur-sm border border-blue-500/30 rounded-xl px-5 py-3 hover:bg-slate-900/60 transition-all duration-300">
              <input
                type="checkbox"
                checked={skipMeditation}
                onChange={(e) => setSkipMeditation(e.target.checked)}
                className="w-4 h-4 rounded border-blue-500/50 bg-slate-800 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-blue-200 text-sm font-medium">
                Skip meditation, I already have my question in mind
              </span>
            </label>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <button 
              className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/40 hover:shadow-blue-400/60 hover:scale-[1.02]"
              onClick={() => onStartReading(cardCount, skipMeditation)}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Icon icon="mdi:shimmer" className="text-xl" />
                Draw the Cards
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </button>

            <button 
              className="w-full flex items-center justify-center gap-2 bg-slate-900/40 hover:bg-slate-900/60 text-blue-200 font-medium py-3 px-6 rounded-xl transition-all duration-300 border border-blue-500/30 hover:border-blue-400/50"
              onClick={onViewGallery}
            >
              <Icon icon="mdi:book-open-page-variant" className="text-lg" />
              View All Cards
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
