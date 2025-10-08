import { useState } from 'react';
import { Icon } from '@iconify/react';
import { CARDS } from '../utils/tarot';

interface CardGalleryProps {
  onBack: () => void;
}

export default function CardGallery({ onBack }: CardGalleryProps) {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const card = selectedCard !== null ? CARDS[selectedCard] : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-purple-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-indigo-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="relative z-10 container mr-auto ml-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors duration-200"
          >
            <Icon icon="mdi:arrow-left" className="text-xl" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-200 to-indigo-300 bg-clip-text text-transparent">
            The 22 Lunar Arcanum
          </h1>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {CARDS.map((card, index) => (
            <button
              key={card.id}
              onClick={() => setSelectedCard(index)}
              className="group relative aspect-[2/3] rounded-xl overflow-hidden border border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 bg-slate-900/50"
            >
              <img
                src={`/tarot/${card.id}.png`}
                alt={card.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <p className="text-white font-bold text-sm md:text-base">{card.name}</p>
                <p className="text-purple-300 text-xs">Arcanum {card.id}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Card Detail Modal */}
        {card && (
          <div
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCard(null)}
          >
            <div
              className="bg-slate-900/95 backdrop-blur-sm rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="md:flex">
                {/* Card Image */}
                <div className="md:w-2/5 p-6">
                  <div className="sticky top-6">
                    <div className="aspect-[2/3] rounded-xl overflow-hidden border border-purple-500/30 shadow-xl">
                      <img
                        src={`/tarot/${card.id}.png`}
                        alt={card.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Card Details */}
                <div className="md:w-3/5 p-6 md:p-8 space-y-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-purple-100 mb-2">{card.name}</h2>
                      <p className="text-sm text-purple-400">Lunar Arcanum {card.id}</p>
                    </div>
                    <button
                      onClick={() => setSelectedCard(null)}
                      className="text-purple-300 hover:text-purple-200 transition-colors"
                    >
                      <Icon icon="mdi:close" className="text-2xl" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">Traditional Meaning</h3>
                      <p className="text-purple-100/90 leading-relaxed">{card.traditional_meaning}</p>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">Lunar Interpretation</h3>
                      <p className="text-purple-100/90 italic leading-relaxed">{card.lunar_interpretation}</p>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">Insight</h3>
                      <p className="text-purple-200 font-semibold leading-relaxed">{card.insight}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">Whispers</h3>
                    <div className="space-y-2">
                      {card.short_phrases.map((phrase, i) => (
                        <p key={i} className="text-indigo-300 italic text-sm">"{phrase}"</p>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                      <p className="text-xs text-purple-400 font-semibold mb-1">Element</p>
                      <p className="text-purple-200 capitalize text-sm">{card.element}</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                      <p className="text-xs text-purple-400 font-semibold mb-1">Tone</p>
                      <p className="text-purple-200 capitalize text-sm">{card.tone}</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                      <p className="text-xs text-purple-400 font-semibold mb-1">Archetype</p>
                      <p className="text-purple-200 capitalize text-sm">{card.narrative_archetype}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {card.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-lg text-xs text-purple-200 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
