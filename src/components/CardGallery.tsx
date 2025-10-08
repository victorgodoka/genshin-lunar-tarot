import { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { CARDS } from '../utils/tarot';

interface CardGalleryProps {
  onBack: () => void;
}

export default function CardGallery({ onBack }: CardGalleryProps) {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [selectedElement, setSelectedElement] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const card = selectedCard !== null ? CARDS[selectedCard] : null;

  // Get unique elements for filtering
  const elements = useMemo(() => {
    const uniqueElements = Array.from(new Set(CARDS.map(card => card.element)));
    return ['all', ...uniqueElements];
  }, []);

  // Filter cards based on element and search term
  const filteredCards = useMemo(() => {
    return CARDS.filter(card => {
      const matchesElement = selectedElement === 'all' || card.element === selectedElement;
      const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           card.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesElement && matchesSearch;
    });
  }, [selectedElement, searchTerm]);

  // Group cards by element for better organization
  const cardsByElement = useMemo(() => {
    const grouped = CARDS.reduce((acc, card, index) => {
      if (!acc[card.element]) acc[card.element] = [];
      acc[card.element].push({ ...card, originalIndex: index });
      return acc;
    }, {} as Record<string, Array<typeof CARDS[0] & { originalIndex: number }>>);
    return grouped;
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-indigo-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors duration-200 bg-purple-500/10 hover:bg-purple-500/20 px-4 py-2 rounded-lg border border-purple-500/30"
            >
              <Icon icon="mdi:arrow-left" className="text-xl" />
              <span className="text-sm font-medium">Back</span>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-200 to-indigo-300 bg-clip-text text-transparent">
              The 22 Lunar Arcanum
            </h1>
          </div>
          
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3 lg:w-auto w-full">
            <div className="relative">
              <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
              <input
                type="text"
                placeholder="Search cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-800/50 border border-purple-500/30 rounded-lg text-purple-100 placeholder-purple-400 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 w-full sm:w-64"
              />
            </div>
            <select
              value={selectedElement}
              onChange={(e) => setSelectedElement(e.target.value)}
              className="px-4 py-2 bg-slate-800/50 border border-purple-500/30 rounded-lg text-purple-100 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 capitalize"
            >
              {elements.map(element => (
                <option key={element} value={element} className="bg-slate-800 capitalize">
                  {element === 'all' ? 'All Elements' : element}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap gap-4 mb-8 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-200">{filteredCards.length}</p>
            <p className="text-xs text-purple-400 uppercase tracking-wider">Cards Shown</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-200">{elements.length - 1}</p>
            <p className="text-xs text-purple-400 uppercase tracking-wider">Elements</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-cyan-200">22</p>
            <p className="text-xs text-purple-400 uppercase tracking-wider">Total Arcanum</p>
          </div>
        </div>

        {/* Card Display */}
        {searchTerm || selectedElement !== 'all' ? (
          /* Filtered Grid View */
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Icon icon="mdi:filter" className="text-purple-400" />
              <h2 className="text-lg font-semibold text-purple-200">
                {searchTerm ? `Search results for "${searchTerm}"` : `${selectedElement.charAt(0).toUpperCase() + selectedElement.slice(1)} Cards`}
              </h2>
              <span className="text-sm text-purple-400">({filteredCards.length} cards)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {filteredCards.map((card) => {
                const originalIndex = CARDS.findIndex(c => c.id === card.id);
                return (
                  <CardItem
                    key={card.id}
                    card={card}
                    onClick={() => setSelectedCard(originalIndex)}
                  />
                );
              })}
            </div>
          </div>
        ) : (
          /* Grouped by Element View */
          <div className="space-y-12">
            {Object.entries(cardsByElement).map(([element, cards]) => (
              <div key={element}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-4 h-4 rounded-full ${
                    element === 'electro' ? 'bg-purple-500' :
                    element === 'hydro' ? 'bg-blue-500' :
                    element === 'dendro' ? 'bg-green-500' :
                    element === 'geo' ? 'bg-yellow-500' :
                    element === 'pyro' ? 'bg-red-500' :
                    element === 'anemo' ? 'bg-cyan-500' :
                    element === 'cryo' ? 'bg-indigo-500' :
                    'bg-gray-500'
                  }`}></div>
                  <h2 className="text-xl font-bold text-purple-200 capitalize">{element}</h2>
                  <span className="text-sm text-purple-400">({cards.length} cards)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                  {cards.map((card) => (
                    <CardItem
                      key={card.id}
                      card={card}
                      onClick={() => setSelectedCard(card.originalIndex)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

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
                        src={`tarot/${card.id}.png`}
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

// Separate CardItem component for better organization
function CardItem({ card, onClick }: { 
  card: typeof CARDS[0]; 
  onClick: () => void; 
}) {
  return (
    <button
      onClick={onClick}
      className="group relative aspect-[2/3] rounded-xl overflow-hidden border border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 bg-slate-900/50"
    >
      <img
        src={`tarot/${card.id}.png`}
        alt={card.name}
        className="w-full h-full object-cover"
      />
      
      {/* Element indicator */}
      <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
        card.element === 'electro' ? 'bg-purple-500' :
        card.element === 'hydro' ? 'bg-blue-500' :
        card.element === 'dendro' ? 'bg-green-500' :
        card.element === 'geo' ? 'bg-yellow-500' :
        card.element === 'pyro' ? 'bg-red-500' :
        card.element === 'anemo' ? 'bg-cyan-500' :
        card.element === 'cryo' ? 'bg-indigo-500' :
        'bg-gray-500'
      } shadow-lg`}></div>
      
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
        <p className="text-white font-bold text-sm md:text-base leading-tight">{card.name}</p>
        <p className="text-purple-300 text-xs">Arcanum {card.id}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {card.tags.slice(0, 2).map((tag, i) => (
            <span key={i} className="px-2 py-0.5 bg-purple-500/30 rounded text-xs text-purple-200">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}
