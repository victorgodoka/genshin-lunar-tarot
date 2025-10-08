import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

interface MeditationProps {
  cardCount: 1 | 3;
  onComplete: () => void;
}

const MEDITATION_PHRASES = {
  single: {
    breath: [
      "Take a deep breath...",
      "Close your eyes and breathe deeply...",
      "Inhale slowly, exhale gently...",
      "Center yourself with a calming breath...",
      "Let your breath guide you to stillness..."
    ],
    focus: [
      "Think about what you want to know...",
      "Focus on your question...",
      "Let your intention crystallize...",
      "What does your heart seek to understand?",
      "Bring your question into clarity..."
    ],
    open: [
      "Open your mind to the wisdom of the cards...",
      "The Arcanum awaits your question...",
      "Let the universe hear your inquiry...",
      "Prepare to receive guidance...",
      "The cards are ready to speak..."
    ]
  },
  three: {
    breath: [
      "Breathe deeply, for the threads of time await...",
      "Still your mind, the past, present, and future converge...",
      "Inhale the mysteries of what was, is, and will be...",
      "Let your breath connect the moments of your journey...",
      "Center yourself at the crossroads of time..."
    ],
    focus: [
      "Reflect on the path that brought you here...",
      "Consider where you stand in this moment...",
      "Envision the horizon that calls to you...",
      "What patterns weave through your story?",
      "How do the echoes of yesterday shape tomorrow?"
    ],
    open: [
      "The cards shall reveal the tapestry of time...",
      "Three voices speak: memory, presence, and promise...",
      "Past shadows, present light, future whispers await...",
      "The Arcanum unfolds your temporal journey...",
      "Witness the dance of what was, what is, what shall be..."
    ]
  }
};

function getRandomPhrase(phrases: string[]): string {
  return phrases[Math.floor(Math.random() * phrases.length)];
}

export default function Meditation({ cardCount, onComplete }: MeditationProps) {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const phraseSet = cardCount === 1 ? MEDITATION_PHRASES.single : MEDITATION_PHRASES.three;
  const [phrases] = useState([
    getRandomPhrase(phraseSet.breath),
    getRandomPhrase(phraseSet.focus),
    getRandomPhrase(phraseSet.open)
  ]);

  useEffect(() => {
    if (currentPhrase < phrases.length) {
      const timer = setTimeout(() => {
        setCurrentPhrase(prev => prev + 1);
      }, 3000); // 3 seconds per phrase

      return () => clearTimeout(timer);
    } else {
      // All phrases shown, wait a moment then complete
      const timer = setTimeout(() => {
        onComplete();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [currentPhrase, phrases.length, onComplete]);

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 max-w-2xl w-full mx-auto px-4 text-center">
        {/* Reading type indicator */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <Icon 
            icon={cardCount === 1 ? "mdi:cards-playing-outline" : "mdi:cards-playing"} 
            className="text-4xl text-blue-300"
          />
          <span className="text-blue-300/80 text-sm uppercase tracking-wider">
            {cardCount === 1 ? 'Single Card Reading' : 'Three Card Spread'}
          </span>
        </div>

        {/* Animated phrases */}
        <div className="min-h-[200px] flex items-center justify-center">
          {phrases.map((phrase, index) => (
            <div
              key={index}
              className={`absolute transition-all duration-1000 ${
                currentPhrase === index
                  ? 'opacity-100 scale-100 translate-y-0'
                  : currentPhrase > index
                  ? 'opacity-0 scale-95 -translate-y-4'
                  : 'opacity-0 scale-95 translate-y-4'
              }`}
            >
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-200 italic leading-relaxed">
                {phrase}
              </p>
            </div>
          ))}
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center gap-2 mt-12">
          {phrases.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-500 ${
                currentPhrase >= index
                  ? 'w-12 bg-blue-400'
                  : 'w-2 bg-blue-500/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
