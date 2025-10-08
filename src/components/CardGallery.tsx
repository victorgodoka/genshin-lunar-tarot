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
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors duration-200 bg-blue-500/10 hover:bg-blue-500/20 px-4 py-2 rounded-lg border border-blue-500/30"
            >
              <Icon icon="mdi:arrow-left" className="text-xl" />
              <span className="text-sm font-medium">Back</span>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-200 to-cyan-300 bg-clip-text text-transparent">
              The 22 Lunar Arcanum
            </h1>
          </div>
          
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3 lg:w-auto w-full">
            <div className="relative">
              <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
              <input
                type="text"
                placeholder="Search cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-800/50 border border-blue-500/30 rounded-lg text-blue-100 placeholder-blue-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 w-full sm:w-64"
              />
            </div>
            <select
              value={selectedElement}
              onChange={(e) => setSelectedElement(e.target.value)}
              className="px-4 py-2 bg-slate-800/50 border border-blue-500/30 rounded-lg text-blue-100 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 capitalize"
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
        <div className="flex flex-wrap gap-4 mb-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-200">{filteredCards.length}</p>
            <p className="text-xs text-blue-400 uppercase tracking-wider">Cards Shown</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-cyan-200">{elements.length - 1}</p>
            <p className="text-xs text-blue-400 uppercase tracking-wider">Elements</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-cyan-200">22</p>
            <p className="text-xs text-blue-400 uppercase tracking-wider">Total Arcanum</p>
          </div>
        </div>

        {/* Card Display */}
        {searchTerm || selectedElement !== 'all' ? (
          /* Filtered Grid View */
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Icon icon="mdi:filter" className="text-blue-400" />
              <h2 className="text-lg font-semibold text-blue-200">
                {searchTerm ? `Search results for "${searchTerm}"` : `${selectedElement.charAt(0).toUpperCase() + selectedElement.slice(1)} Cards`}
              </h2>
              <span className="text-sm text-blue-400">({filteredCards.length} cards)</span>
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
                    element === 'anemo' ? 'bg-teal-500' :
                    element === 'cryo' ? 'bg-cyan-500' :
                    'bg-gray-500'
                  }`}></div>
                  <h2 className="text-xl font-bold text-blue-200 capitalize">{element}</h2>
                  <span className="text-sm text-blue-400">({cards.length} cards)</span>
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
              className={`bg-slate-900/95 backdrop-blur-sm rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border shadow-2xl ${
              card.element === 'electro' ? 'border-purple-500/30' :
              card.element === 'hydro' ? 'border-blue-500/30' :
              card.element === 'dendro' ? 'border-green-500/30' :
              card.element === 'geo' ? 'border-yellow-500/30' :
              card.element === 'pyro' ? 'border-red-500/30' :
              card.element === 'anemo' ? 'border-teal-500/30' :
              card.element === 'cryo' ? 'border-cyan-500/30' :
              'border-gray-500/30'
            }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="md:flex">
                {/* Card Image */}
                <div className="md:w-2/5 p-6">
                  <div className="sticky top-6">
                    <div className={`aspect-[2/3] rounded-xl overflow-hidden border shadow-xl ${
                      card.element === 'electro' ? 'border-purple-500/30' :
                      card.element === 'hydro' ? 'border-blue-500/30' :
                      card.element === 'dendro' ? 'border-green-500/30' :
                      card.element === 'geo' ? 'border-yellow-500/30' :
                      card.element === 'pyro' ? 'border-red-500/30' :
                      card.element === 'anemo' ? 'border-teal-500/30' :
                      card.element === 'cryo' ? 'border-cyan-500/30' :
                      'border-gray-500/30'
                    }`}>
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
                      <h2 className={`text-3xl md:text-4xl font-bold mb-2 ${
                        card.element === 'electro' ? 'text-purple-100' :
                        card.element === 'hydro' ? 'text-blue-100' :
                        card.element === 'dendro' ? 'text-green-100' :
                        card.element === 'geo' ? 'text-yellow-100' :
                        card.element === 'pyro' ? 'text-red-100' :
                        card.element === 'anemo' ? 'text-teal-100' :
                        card.element === 'cryo' ? 'text-cyan-100' :
                        'text-gray-100'
                      }`}>{card.name}</h2>
                      <p className={`text-sm ${
                        card.element === 'electro' ? 'text-purple-400' :
                        card.element === 'hydro' ? 'text-blue-400' :
                        card.element === 'dendro' ? 'text-green-400' :
                        card.element === 'geo' ? 'text-yellow-400' :
                        card.element === 'pyro' ? 'text-red-400' :
                        card.element === 'anemo' ? 'text-teal-400' :
                        card.element === 'cryo' ? 'text-cyan-400' :
                        'text-gray-400'
                      }`}>Lunar Arcanum {card.id}</p>
                    </div>
                    <button
                      onClick={() => setSelectedCard(null)}
                      className={`transition-colors ${
                        card.element === 'electro' ? 'text-purple-300 hover:text-purple-200' :
                        card.element === 'hydro' ? 'text-blue-300 hover:text-blue-200' :
                        card.element === 'dendro' ? 'text-green-300 hover:text-green-200' :
                        card.element === 'geo' ? 'text-yellow-300 hover:text-yellow-200' :
                        card.element === 'pyro' ? 'text-red-300 hover:text-red-200' :
                        card.element === 'anemo' ? 'text-teal-300 hover:text-teal-200' :
                        card.element === 'cryo' ? 'text-cyan-300 hover:text-cyan-200' :
                        'text-gray-300 hover:text-gray-200'
                      }`}
                    >
                      <Icon icon="mdi:close" className="text-2xl" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                        card.element === 'electro' ? 'text-purple-400' :
                        card.element === 'hydro' ? 'text-blue-400' :
                        card.element === 'dendro' ? 'text-green-400' :
                        card.element === 'geo' ? 'text-yellow-400' :
                        card.element === 'pyro' ? 'text-red-400' :
                        card.element === 'anemo' ? 'text-teal-400' :
                        card.element === 'cryo' ? 'text-cyan-400' :
                        'text-gray-400'
                      }`}>Traditional Meaning</h3>
                      <p className={`leading-relaxed ${
                        card.element === 'electro' ? 'text-purple-100/90' :
                        card.element === 'hydro' ? 'text-blue-100/90' :
                        card.element === 'dendro' ? 'text-green-100/90' :
                        card.element === 'geo' ? 'text-yellow-100/90' :
                        card.element === 'pyro' ? 'text-red-100/90' :
                        card.element === 'anemo' ? 'text-teal-100/90' :
                        card.element === 'cryo' ? 'text-cyan-100/90' :
                        'text-gray-100/90'
                      }`}>{card.traditional_meaning}</p>
                    </div>

                    <div>
                      <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                        card.element === 'electro' ? 'text-purple-400' :
                        card.element === 'hydro' ? 'text-blue-400' :
                        card.element === 'dendro' ? 'text-green-400' :
                        card.element === 'geo' ? 'text-yellow-400' :
                        card.element === 'pyro' ? 'text-red-400' :
                        card.element === 'anemo' ? 'text-teal-400' :
                        card.element === 'cryo' ? 'text-cyan-400' :
                        'text-gray-400'
                      }`}>Lunar Interpretation</h3>
                      <p className={`italic leading-relaxed ${
                        card.element === 'electro' ? 'text-purple-100/90' :
                        card.element === 'hydro' ? 'text-blue-100/90' :
                        card.element === 'dendro' ? 'text-green-100/90' :
                        card.element === 'geo' ? 'text-yellow-100/90' :
                        card.element === 'pyro' ? 'text-red-100/90' :
                        card.element === 'anemo' ? 'text-teal-100/90' :
                        card.element === 'cryo' ? 'text-cyan-100/90' :
                        'text-gray-100/90'
                      }`}>{card.lunar_interpretation}</p>
                    </div>

                    <div>
                      <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                        card.element === 'electro' ? 'text-purple-400' :
                        card.element === 'hydro' ? 'text-blue-400' :
                        card.element === 'dendro' ? 'text-green-400' :
                        card.element === 'geo' ? 'text-yellow-400' :
                        card.element === 'pyro' ? 'text-red-400' :
                        card.element === 'anemo' ? 'text-teal-400' :
                        card.element === 'cryo' ? 'text-cyan-400' :
                        'text-gray-400'
                      }`}>Insight</h3>
                      <p className={`font-semibold leading-relaxed ${
                        card.element === 'electro' ? 'text-purple-200' :
                        card.element === 'hydro' ? 'text-blue-200' :
                        card.element === 'dendro' ? 'text-green-200' :
                        card.element === 'geo' ? 'text-yellow-200' :
                        card.element === 'pyro' ? 'text-red-200' :
                        card.element === 'anemo' ? 'text-teal-200' :
                        card.element === 'cryo' ? 'text-cyan-200' :
                        'text-gray-200'
                      }`}>{card.insight}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                      card.element === 'electro' ? 'text-purple-400' :
                      card.element === 'hydro' ? 'text-blue-400' :
                      card.element === 'dendro' ? 'text-green-400' :
                      card.element === 'geo' ? 'text-yellow-400' :
                      card.element === 'pyro' ? 'text-red-400' :
                      card.element === 'anemo' ? 'text-teal-400' :
                      card.element === 'cryo' ? 'text-cyan-400' :
                      'text-gray-400'
                    }`}>Whispers</h3>
                    <div className="space-y-2">
                      {card.short_phrases.map((phrase, i) => (
                        <p key={i} className={`italic text-sm ${
                          card.element === 'electro' ? 'text-purple-300' :
                          card.element === 'hydro' ? 'text-cyan-300' :
                          card.element === 'dendro' ? 'text-green-300' :
                          card.element === 'geo' ? 'text-yellow-300' :
                          card.element === 'pyro' ? 'text-red-300' :
                          card.element === 'anemo' ? 'text-teal-300' :
                          card.element === 'cryo' ? 'text-cyan-300' :
                          'text-gray-300'
                        }`}>"{phrase}"</p>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className={`rounded-lg p-3 ${
                      card.element === 'electro' ? 'bg-purple-500/10 border border-purple-500/30' :
                      card.element === 'hydro' ? 'bg-blue-500/10 border border-blue-500/30' :
                      card.element === 'dendro' ? 'bg-green-500/10 border border-green-500/30' :
                      card.element === 'geo' ? 'bg-yellow-500/10 border border-yellow-500/30' :
                      card.element === 'pyro' ? 'bg-red-500/10 border border-red-500/30' :
                      card.element === 'anemo' ? 'bg-teal-500/10 border border-teal-500/30' :
                      card.element === 'cryo' ? 'bg-cyan-500/10 border border-cyan-500/30' :
                      'bg-gray-500/10 border border-gray-500/30'
                    }`}>
                      <p className={`text-xs font-semibold mb-1 ${
                        card.element === 'electro' ? 'text-purple-400' :
                        card.element === 'hydro' ? 'text-blue-400' :
                        card.element === 'dendro' ? 'text-green-400' :
                        card.element === 'geo' ? 'text-yellow-400' :
                        card.element === 'pyro' ? 'text-red-400' :
                        card.element === 'anemo' ? 'text-teal-400' :
                        card.element === 'cryo' ? 'text-cyan-400' :
                        'text-gray-400'
                      }`}>Element</p>
                      <p className={`capitalize text-sm ${
                        card.element === 'electro' ? 'text-purple-200' :
                        card.element === 'hydro' ? 'text-blue-200' :
                        card.element === 'dendro' ? 'text-green-200' :
                        card.element === 'geo' ? 'text-yellow-200' :
                        card.element === 'pyro' ? 'text-red-200' :
                        card.element === 'anemo' ? 'text-teal-200' :
                        card.element === 'cryo' ? 'text-cyan-200' :
                        'text-gray-200'
                      }`}>{card.element}</p>
                    </div>
                    <div className={`rounded-lg p-3 ${
                      card.element === 'electro' ? 'bg-purple-500/10 border border-purple-500/30' :
                      card.element === 'hydro' ? 'bg-blue-500/10 border border-blue-500/30' :
                      card.element === 'dendro' ? 'bg-green-500/10 border border-green-500/30' :
                      card.element === 'geo' ? 'bg-yellow-500/10 border border-yellow-500/30' :
                      card.element === 'pyro' ? 'bg-red-500/10 border border-red-500/30' :
                      card.element === 'anemo' ? 'bg-teal-500/10 border border-teal-500/30' :
                      card.element === 'cryo' ? 'bg-cyan-500/10 border border-cyan-500/30' :
                      'bg-gray-500/10 border border-gray-500/30'
                    }`}>
                      <p className={`text-xs font-semibold mb-1 ${
                        card.element === 'electro' ? 'text-purple-400' :
                        card.element === 'hydro' ? 'text-blue-400' :
                        card.element === 'dendro' ? 'text-green-400' :
                        card.element === 'geo' ? 'text-yellow-400' :
                        card.element === 'pyro' ? 'text-red-400' :
                        card.element === 'anemo' ? 'text-teal-400' :
                        card.element === 'cryo' ? 'text-cyan-400' :
                        'text-gray-400'
                      }`}>Tone</p>
                      <p className={`capitalize text-sm ${
                        card.element === 'electro' ? 'text-purple-200' :
                        card.element === 'hydro' ? 'text-blue-200' :
                        card.element === 'dendro' ? 'text-green-200' :
                        card.element === 'geo' ? 'text-yellow-200' :
                        card.element === 'pyro' ? 'text-red-200' :
                        card.element === 'anemo' ? 'text-teal-200' :
                        card.element === 'cryo' ? 'text-cyan-200' :
                        'text-gray-200'
                      }`}>{card.tone}</p>
                    </div>
                    <div className={`rounded-lg p-3 ${
                      card.element === 'electro' ? 'bg-purple-500/10 border border-purple-500/30' :
                      card.element === 'hydro' ? 'bg-blue-500/10 border border-blue-500/30' :
                      card.element === 'dendro' ? 'bg-green-500/10 border border-green-500/30' :
                      card.element === 'geo' ? 'bg-yellow-500/10 border border-yellow-500/30' :
                      card.element === 'pyro' ? 'bg-red-500/10 border border-red-500/30' :
                      card.element === 'anemo' ? 'bg-teal-500/10 border border-teal-500/30' :
                      card.element === 'cryo' ? 'bg-cyan-500/10 border border-cyan-500/30' :
                      'bg-gray-500/10 border border-gray-500/30'
                    }`}>
                      <p className={`text-xs font-semibold mb-1 ${
                        card.element === 'electro' ? 'text-purple-400' :
                        card.element === 'hydro' ? 'text-blue-400' :
                        card.element === 'dendro' ? 'text-green-400' :
                        card.element === 'geo' ? 'text-yellow-400' :
                        card.element === 'pyro' ? 'text-red-400' :
                        card.element === 'anemo' ? 'text-teal-400' :
                        card.element === 'cryo' ? 'text-cyan-400' :
                        'text-gray-400'
                      }`}>Archetype</p>
                      <p className={`capitalize text-sm ${
                        card.element === 'electro' ? 'text-purple-200' :
                        card.element === 'hydro' ? 'text-blue-200' :
                        card.element === 'dendro' ? 'text-green-200' :
                        card.element === 'geo' ? 'text-yellow-200' :
                        card.element === 'pyro' ? 'text-red-200' :
                        card.element === 'anemo' ? 'text-teal-200' :
                        card.element === 'cryo' ? 'text-cyan-200' :
                        'text-gray-200'
                      }`}>{card.narrative_archetype}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                      card.element === 'electro' ? 'text-purple-400' :
                      card.element === 'hydro' ? 'text-blue-400' :
                      card.element === 'dendro' ? 'text-green-400' :
                      card.element === 'geo' ? 'text-yellow-400' :
                      card.element === 'pyro' ? 'text-red-400' :
                      card.element === 'anemo' ? 'text-teal-400' :
                      card.element === 'cryo' ? 'text-cyan-400' :
                      'text-gray-400'
                    }`}>Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {card.tags.map((tag, i) => (
                        <span
                          key={i}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                            card.element === 'electro' ? 'bg-purple-500/20 border border-purple-500/30 text-purple-200' :
                            card.element === 'hydro' ? 'bg-blue-500/20 border border-blue-500/30 text-blue-200' :
                            card.element === 'dendro' ? 'bg-green-500/20 border border-green-500/30 text-green-200' :
                            card.element === 'geo' ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-200' :
                            card.element === 'pyro' ? 'bg-red-500/20 border border-red-500/30 text-red-200' :
                            card.element === 'anemo' ? 'bg-teal-500/20 border border-teal-500/30 text-teal-200' :
                            card.element === 'cryo' ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-200' :
                            'bg-gray-500/20 border border-gray-500/30 text-gray-200'
                          }`}
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
      className={`group relative aspect-[2/3] rounded-xl overflow-hidden border transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-slate-900/50 ${
        card.element === 'electro' ? 'border-purple-500/30 hover:border-purple-400/60 hover:shadow-purple-500/30' :
        card.element === 'hydro' ? 'border-blue-500/30 hover:border-blue-400/60 hover:shadow-blue-500/30' :
        card.element === 'dendro' ? 'border-green-500/30 hover:border-green-400/60 hover:shadow-green-500/30' :
        card.element === 'geo' ? 'border-yellow-500/30 hover:border-yellow-400/60 hover:shadow-yellow-500/30' :
        card.element === 'pyro' ? 'border-red-500/30 hover:border-red-400/60 hover:shadow-red-500/30' :
        card.element === 'anemo' ? 'border-teal-500/30 hover:border-teal-400/60 hover:shadow-teal-500/30' :
        card.element === 'cryo' ? 'border-cyan-500/30 hover:border-cyan-400/60 hover:shadow-cyan-500/30' :
        'border-gray-500/30 hover:border-gray-400/60 hover:shadow-gray-500/30'
      }`}
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
        card.element === 'anemo' ? 'bg-teal-500' :
        card.element === 'cryo' ? 'bg-cyan-500' :
        'bg-gray-500'
      } shadow-lg`}></div>
      
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
        <p className="text-white font-bold text-sm md:text-base leading-tight">{card.name}</p>
        <p className={`text-xs ${
          card.element === 'electro' ? 'text-purple-300' :
          card.element === 'hydro' ? 'text-blue-300' :
          card.element === 'dendro' ? 'text-green-300' :
          card.element === 'geo' ? 'text-yellow-300' :
          card.element === 'pyro' ? 'text-red-300' :
          card.element === 'anemo' ? 'text-teal-300' :
          card.element === 'cryo' ? 'text-cyan-300' :
          'text-gray-300'
        }`}>Arcanum {card.id}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {card.tags.slice(0, 2).map((tag, i) => (
            <span key={i} className={`px-2 py-0.5 rounded text-xs ${
              card.element === 'electro' ? 'bg-purple-500/30 text-purple-200' :
              card.element === 'hydro' ? 'bg-blue-500/30 text-blue-200' :
              card.element === 'dendro' ? 'bg-green-500/30 text-green-200' :
              card.element === 'geo' ? 'bg-yellow-500/30 text-yellow-200' :
              card.element === 'pyro' ? 'bg-red-500/30 text-red-200' :
              card.element === 'anemo' ? 'bg-teal-500/30 text-teal-200' :
              card.element === 'cryo' ? 'bg-cyan-500/30 text-cyan-200' :
              'bg-gray-500/30 text-gray-200'
            }`}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}
