import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { generateReading, exportReadingAsText, type Reading as ReadingType } from '../utils/narrativeEngine';

interface ReadingProps {
  cardCount: 1 | 3;
  onBack: () => void;
  onNewReadingWithMeditation: () => void;
  sharedReading?: ReadingType | null;
}

const READING_LABELS: Record<number, string[]> = {
  1: ['Your Answer'],
  3: ['Past', 'Present', 'Future']
};

export default function Reading({ cardCount, onBack, onNewReadingWithMeditation, sharedReading }: ReadingProps) {
  const [reading, setReading] = useState<ReadingType | null>(null);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [showNarrative, setShowNarrative] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  useEffect(() => {
    // Use shared reading if available, otherwise generate new one
    const newReading = sharedReading || generateReading(cardCount);
    setReading(newReading);
    
    // Flip cards one by one with animation
    const flipTimers: number[] = [];
    newReading.cards.forEach((_, index) => {
      const timer = setTimeout(() => {
        setFlippedCards(prev => new Set([...prev, index]));
      }, (index + 1) * 600);
      flipTimers.push(timer);
    });

    // Show narrative after all cards are flipped
    const narrativeTimer = setTimeout(() => {
      setShowNarrative(true);
    }, (newReading.cards.length + 1) * 600);
    flipTimers.push(narrativeTimer);

    return () => flipTimers.forEach(timer => clearTimeout(timer));
  }, [cardCount, sharedReading]);

  const handleQuickNewReading = () => {
    setFlippedCards(new Set());
    setShowNarrative(false);
    const newReading = generateReading(cardCount);
    setReading(newReading);

    const flipTimers: number[] = [];
    newReading.cards.forEach((_, index) => {
      const timer = setTimeout(() => {
        setFlippedCards(prev => new Set([...prev, index]));
      }, (index + 1) * 600);
      flipTimers.push(timer);
    });

    const narrativeTimer = setTimeout(() => {
      setShowNarrative(true);
    }, (newReading.cards.length + 1) * 600);
    flipTimers.push(narrativeTimer);
  };

  const handleShare = () => {
    if (!reading || !reading.seed) return;
    
    const shareUrl = `${window.location.origin}${window.location.pathname}?seed=${reading.seed}&count=${cardCount}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Lunar Arcanum Tarot Reading',
        text: 'Check out my tarot reading from the Lunar Arcanum!',
        url: shareUrl
      }).catch(console.error);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        // You could add a toast notification here
        alert('Reading link copied to clipboard!');
      }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Reading link copied to clipboard!');
      });
    }
  };

  const handleExport = () => {
    if (!reading) return;
    const text = exportReadingAsText(reading);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lunar-arcanum-reading-${reading.seed}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!reading) return null;

  return (
    <div className="min-h-screen relative overflow-hidden pb-16">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
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
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={onNewReadingWithMeditation}
              className="flex items-center gap-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 font-medium py-2 px-4 rounded-lg transition-all duration-200 border border-purple-500/30 text-sm"
            >
              <Icon icon="mdi:meditation" className="text-lg" />
              New Reading
            </button>
            <button
              onClick={handleQuickNewReading}
              className="flex items-center gap-2 bg-violet-500/20 hover:bg-violet-500/30 text-violet-200 font-medium py-2 px-4 rounded-lg transition-all duration-200 border border-violet-500/30 text-sm"
            >
              <Icon icon="mdi:refresh" className="text-lg" />
              Quick Reading
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 font-medium py-2 px-4 rounded-lg transition-all duration-200 border border-emerald-500/30 text-sm"
            >
              <Icon icon="mdi:share" className="text-lg" />
              Share
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 font-medium py-2 px-4 rounded-lg transition-all duration-200 border border-indigo-500/30 text-sm"
            >
              <Icon icon="mdi:download" className="text-lg" />
              Export
            </button>
          </div>
        </div>

        {/* Cards Display */}
        <div className="mb-16">
          <div className={`grid gap-6 ${cardCount === 1 ? 'grid-cols-1 max-w-sm mx-auto' : 'grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto'}`}>
            {reading.cards.map((card, index) => {
              const labels = READING_LABELS[cardCount];
              const label = labels[index];
              
              return (
                <div
                  key={card.id}
                  className={`transition-all duration-700 ${
                    flippedCards.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="relative group">
                    {/* Position Label */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span className="text-purple-200 font-semibold text-xs uppercase tracking-wider px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full shadow-lg">
                        {label}
                      </span>
                    </div>
                    
                    {/* Card */}
                    <button
                      onClick={() => setSelectedCard(index)}
                      className="w-full relative rounded-2xl overflow-hidden border border-purple-500/30 bg-slate-900/50 backdrop-blur-sm hover:border-purple-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer"
                    >
                      {/* Card Image */}
                      <div className="relative overflow-hidden p-4">
                        <img
                          src={`tarot/${card.id}.png`}
                          alt={card.name}
                          className={`w-full h-full object-cover transition-transform duration-300 ${
                            card.reversed ? 'rotate-180' : ''
                          }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                        
                        {/* Reversed Indicator */}
                        {card.reversed && (
                          <div className="absolute top-2 right-2 bg-red-500/80 text-white text-xs px-2 py-1 rounded-full font-semibold">
                            REVERSED
                          </div>
                        )}
                      </div>
                      
                      {/* Card Info */}
                      <div className="p-4 space-y-2 text-left absolute bottom-0">
                        <h3 className="text-xl font-bold text-purple-100">
                          {card.name}
                          {card.reversed && <span className="text-red-300 text-sm ml-2">(Reversed)</span>}
                        </h3>
                        <p className="text-sm text-indigo-300 italic">
                          "{card.reversed && card.reversed_phrases ? card.reversed_phrases[0] : card.short_phrases[0]}"
                        </p>
                        <p className="text-xs text-purple-300/70 leading-relaxed">
                          {card.reversed && card.reversed_insight ? card.reversed_insight : card.insight}
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Yes/No Answer (for single card) */}
        {cardCount === 1 && reading.yesNoAnswer && (
          <div
            className={`transition-all duration-1000 mb-12 ${
              showNarrative ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="max-w-3xl mx-auto">
              {/* Mystical phrase */}
              <div className="text-center mb-8">
                <div className={`text-3xl md:text-4xl font-bold italic leading-relaxed ${
                  reading.yesNoAnswer.answer === 'yes' ? 'text-green-300' :
                  reading.yesNoAnswer.answer === 'no' ? 'text-red-300' :
                  'text-yellow-300'
                }`}>
                  "{reading.yesNoAnswer.mysticalPhrase}"
                </div>
              </div>
              
              {/* Context indicators */}
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(reading.yesNoAnswer.context).map(([key, value]) => {
                  const getIcon = () => {
                    if (value === 'yes') return 'mdi:check-circle';
                    if (value === 'no') return 'mdi:close-circle';
                    return 'mdi:help-circle';
                  };
                  
                  const getColor = () => {
                    if (value === 'yes') return 'text-green-400 border-green-500/30 bg-green-500/10';
                    if (value === 'no') return 'text-red-400 border-red-500/30 bg-red-500/10';
                    return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
                  };

                  return (
                    <div key={key} className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${getColor()} backdrop-blur-sm transition-all duration-300 hover:scale-105`}>
                      <Icon 
                        icon={getIcon()} 
                        className="text-3xl"
                      />
                      <span className="text-purple-200 capitalize text-sm font-semibold">{key}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Narrative */}
        <div
          className={`transition-all duration-1000 ${
            showNarrative ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-900/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 md:p-10">
              <div className="space-y-6">
                {reading.narrative.split('\n\n').map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-purple-100/90 leading-relaxed text-lg first-letter:text-3xl first-letter:font-bold first-letter:text-purple-300"
                    dangerouslySetInnerHTML={{
                      __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="text-purple-300 font-semibold">$1</strong>')
                    }}
                  />
                ))}
              </div>
              {reading.seed && (
                <div className="mt-8 pt-6 border-t border-purple-500/20">
                  <p className="text-center text-xs text-purple-400/50 font-mono">
                    Reading Seed: {reading.seed}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card Detail Modal */}
        {selectedCard !== null && reading && (
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
                    <div className="aspect-[2/3] rounded-xl overflow-hidden border border-purple-500/30 shadow-xl relative">
                      <img
                        src={`tarot/${reading.cards[selectedCard].id}.png`}
                        alt={reading.cards[selectedCard].name}
                        className={`w-full h-full object-cover p-2 transition-transform duration-300 ${
                          reading.cards[selectedCard].reversed ? 'rotate-180' : ''
                        }`}
                      />
                      {reading.cards[selectedCard].reversed && (
                        <div className="absolute top-2 right-2 bg-red-500/80 text-white text-xs px-2 py-1 rounded-full font-semibold">
                          REVERSED
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Details */}
                <div className="md:w-3/5 p-6 md:p-8 space-y-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-purple-100 mb-2">
                        {reading.cards[selectedCard].name}
                        {reading.cards[selectedCard].reversed && <span className="text-red-300 text-lg ml-2">(Reversed)</span>}
                      </h2>
                      <p className="text-sm text-purple-400">Lunar Arcanum {reading.cards[selectedCard].id}</p>
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
                      <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">
                        {reading.cards[selectedCard].reversed ? 'Reversed Meaning' : 'Traditional Meaning'}
                      </h3>
                      <p className="text-purple-100/90 leading-relaxed">
                        {reading.cards[selectedCard].reversed && reading.cards[selectedCard].reversed_meaning 
                          ? reading.cards[selectedCard].reversed_meaning 
                          : reading.cards[selectedCard].traditional_meaning}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">
                        {reading.cards[selectedCard].reversed ? 'Reversed Interpretation' : 'Lunar Interpretation'}
                      </h3>
                      <p className="text-purple-100/90 italic leading-relaxed">
                        {reading.cards[selectedCard].reversed && reading.cards[selectedCard].reversed_interpretation 
                          ? reading.cards[selectedCard].reversed_interpretation 
                          : reading.cards[selectedCard].lunar_interpretation}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">
                        {reading.cards[selectedCard].reversed ? 'Reversed Insight' : 'Insight'}
                      </h3>
                      <p className="text-purple-200 font-semibold leading-relaxed">
                        {reading.cards[selectedCard].reversed && reading.cards[selectedCard].reversed_insight 
                          ? reading.cards[selectedCard].reversed_insight 
                          : reading.cards[selectedCard].insight}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">
                      {reading.cards[selectedCard].reversed ? 'Reversed Whispers' : 'Whispers'}
                    </h3>
                    <div className="space-y-2">
                      {(reading.cards[selectedCard].reversed && reading.cards[selectedCard].reversed_phrases 
                        ? reading.cards[selectedCard].reversed_phrases 
                        : reading.cards[selectedCard].short_phrases
                      ).map((phrase, i) => (
                        <p key={i} className="text-indigo-300 italic text-sm">"{phrase}"</p>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                      <p className="text-xs text-purple-400 font-semibold mb-1">Element</p>
                      <p className="text-purple-200 capitalize text-sm">{reading.cards[selectedCard].element}</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                      <p className="text-xs text-purple-400 font-semibold mb-1">Tone</p>
                      <p className="text-purple-200 capitalize text-sm">{reading.cards[selectedCard].tone}</p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                      <p className="text-xs text-purple-400 font-semibold mb-1">Archetype</p>
                      <p className="text-purple-200 capitalize text-sm">{reading.cards[selectedCard].narrative_archetype}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {reading.cards[selectedCard].tags.map((tag, i) => (
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
