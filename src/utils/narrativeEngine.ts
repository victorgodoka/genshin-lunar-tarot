import { CARDS, NARRATIVES, YESNOQUESTIONS, ANSWER_PHRASES } from './tarot';

export interface Card {
  id: number;
  name: string;
  title: string;
  traditional_meaning: string;
  lunar_interpretation: string;
  insight: string;
  tags: string[];
  narrative_archetype: string;
  element: string;
  tone: string;
  short_phrases: string[];
  reversed?: boolean;
  reversed_meaning?: string;
  reversed_interpretation?: string;
  reversed_insight?: string;
  reversed_phrases?: string[];
}

export interface YesNoAnswer {
  answer: 'yes' | 'no' | 'neutral';
  interpretation: string;
  phrases: string[];
  mysticalPhrase: string;
  context: {
    love: 'yes' | 'no' | 'neutral';
    family: 'yes' | 'no' | 'neutral';
    work: 'yes' | 'no' | 'neutral';
  };
}

export interface Reading {
  cards: Card[];
  narrative: string;
  seed?: number;
  yesNoAnswer?: YesNoAnswer;
}

// Card appearance templates
const CARD_APPEARANCE_TEMPLATES = [
  (name: string, phrase: string) => `**${name}** emerges from the deck, whispering: "${phrase}"`,
  (name: string, phrase: string) => `**${name}** appears, speaking softly: "${phrase}"`,
  (name: string, phrase: string) => `**${name}** reveals itself, murmuring: "${phrase}"`,
  (name: string, phrase: string) => `**${name}** materializes before you: "${phrase}"`,
  (name: string, phrase: string) => `**${name}** surfaces from the shadows: "${phrase}"`,
  (name: string, phrase: string) => `**${name}** steps forward, its voice echoing: "${phrase}"`,
  (name: string, phrase: string) => `**${name}** manifests, breathing: "${phrase}"`,
  (name: string, phrase: string) => `**${name}** rises to meet you: "${phrase}"`,
  (name: string, phrase: string) => `**${name}** draws near, its essence conveying: "${phrase}"`,
  (name: string, phrase: string) => `**${name}** unfolds before your eyes: "${phrase}"`,
  (name: string, phrase: string) => `**${name}** calls out from the depths: "${phrase}"`,
  (name: string, phrase: string) => `**${name}** shimmers into view, declaring: "${phrase}"`,
];

// Seeded random number generator
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

// Fisher-Yates shuffle with optional seed and reversed cards
export function shuffleDeck(seed?: number): Card[] {
  const deck = [...CARDS];
  const rng = seed !== undefined ? new SeededRandom(seed) : null;
  
  // Shuffle positions
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor((rng ? rng.next() : Math.random()) * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  
  // Randomly assign reversed status (30% chance for each card)
  return deck.map(card => ({
    ...card,
    reversed: (rng ? rng.next() : Math.random()) < 0.3
  }));
}

// Draw N cards from the deck
export function drawCards(count: number, seed?: number): Card[] {
  const shuffled = shuffleDeck(seed);
  return shuffled.slice(0, count);
}

// Determine relationship between two archetypes
function getRelationship(archetype1: string, archetype2: string): 'reinforcement' | 'contrast' | 'between_cards' {
  // Define complementary archetypes
  const complementary: Record<string, string[]> = {
    'initiator': ['creator', 'warrior', 'champion'],
    'seer': ['dreamer', 'guide', 'wanderer'],
    'creator': ['initiator', 'weaver', 'alchemist'],
    'ruler': ['judge', 'warrior', 'herald'],
    'teacher': ['guide', 'seer', 'wanderer'],
    'partner': ['weaver', 'creator'],
    'destroyer': ['reaper', 'trickster'],
    'warrior': ['champion', 'initiator', 'ruler'],
    'wanderer': ['seer', 'teacher', 'guide'],
    'weaver': ['creator', 'partner', 'alchemist'],
    'trickster': ['destroyer', 'dreamer'],
    'guide': ['teacher', 'seer', 'illuminator'],
    'dreamer': ['seer', 'trickster', 'wanderer'],
    'illuminator': ['guide', 'teacher'],
    'herald': ['ruler', 'judge'],
    'martyr': ['reaper', 'warrior'],
    'reaper': ['destroyer', 'martyr'],
    'judge': ['ruler', 'herald'],
    'alchemist': ['creator', 'weaver'],
    'champion': ['warrior', 'initiator']
  };

  // Define opposing archetypes
  const opposing: Record<string, string[]> = {
    'initiator': ['reaper', 'destroyer', 'martyr'],
    'seer': ['trickster', 'destroyer'],
    'creator': ['destroyer', 'reaper'],
    'ruler': ['trickster', 'wanderer'],
    'teacher': ['trickster', 'destroyer'],
    'partner': ['martyr', 'wanderer'],
    'destroyer': ['creator', 'initiator', 'weaver'],
    'warrior': ['martyr', 'wanderer'],
    'wanderer': ['ruler', 'warrior', 'partner'],
    'weaver': ['destroyer', 'trickster'],
    'trickster': ['ruler', 'teacher', 'judge'],
    'guide': ['trickster', 'destroyer'],
    'dreamer': ['judge', 'ruler'],
    'illuminator': ['destroyer', 'trickster'],
    'herald': ['trickster', 'wanderer'],
    'martyr': ['initiator', 'warrior'],
    'reaper': ['initiator', 'creator'],
    'judge': ['trickster', 'dreamer'],
    'alchemist': ['destroyer'],
    'champion': ['martyr', 'reaper']
  };

  if (archetype1 === archetype2) {
    return 'reinforcement';
  }

  if (complementary[archetype1]?.includes(archetype2)) {
    return 'reinforcement';
  }

  if (opposing[archetype1]?.includes(archetype2)) {
    return 'contrast';
  }

  return 'between_cards';
}

// Get a random phrase from an array
function getRandomPhrase(phrases: string[], seed?: SeededRandom): string {
  const index = Math.floor((seed ? seed.next() : Math.random()) * phrases.length);
  return phrases[index];
}

// Get yes/no answer for a card
export function getYesNoAnswer(cardId: number, archetype: string, seed?: SeededRandom): YesNoAnswer | null {
  const yesNoData = YESNOQUESTIONS[cardId.toString() as keyof typeof YESNOQUESTIONS];
  if (!yesNoData) return null;

  // Determine overall answer based on context
  const contexts = [yesNoData.context.love, yesNoData.context.family, yesNoData.context.work];
  const yesCount = contexts.filter(c => c === 'yes').length;
  const noCount = contexts.filter(c => c === 'no').length;
  
  let answer: 'yes' | 'no' | 'neutral';
  if (yesCount > noCount) {
    answer = 'yes';
  } else if (noCount > yesCount) {
    answer = 'no';
  } else {
    answer = 'neutral';
  }

  // Get mystical phrase based on archetype and answer
  const archetypePhrases = ANSWER_PHRASES[answer][archetype as keyof typeof ANSWER_PHRASES.yes];
  const mysticalPhrase = archetypePhrases 
    ? getRandomPhrase(archetypePhrases, seed)
    : `The cards speak: ${answer}`;

  return {
    answer,
    interpretation: yesNoData.interpretation,
    phrases: yesNoData.phrases,
    mysticalPhrase,
    context: {
      love: yesNoData.context.love as 'yes' | 'no' | 'neutral',
      family: yesNoData.context.family as 'yes' | 'no' | 'neutral',
      work: yesNoData.context.work as 'yes' | 'no' | 'neutral'
    }
  };
}

// Generate procedural narrative
export function generateNarrative(cards: Card[], seed?: number, includeYesNo: boolean = false): string {
  if (cards.length === 0) return '';

  const rng = seed !== undefined ? new SeededRandom(seed) : null;
  const paragraphs: string[] = [];

  // Special handling for single card reading (yes/no)
  if (cards.length === 1) {
    const card = cards[0];
    const archetype = card.narrative_archetype;
    const transitions = NARRATIVES.transitions[archetype as keyof typeof NARRATIVES.transitions];
    
    if (transitions) {
      const intro = getRandomPhrase(transitions.intro, rng || undefined);
      const finale = getRandomPhrase(transitions.finale, rng || undefined);
      
      let paragraph = intro + ' ';
      const shortPhrases = card.reversed && card.reversed_phrases ? card.reversed_phrases : card.short_phrases;
      const shortPhrase = getRandomPhrase(shortPhrases, rng || undefined);
      const templateIndex = Math.floor((rng ? rng.next() : Math.random()) * CARD_APPEARANCE_TEMPLATES.length);
      const cardName = card.reversed ? `${card.name} (Reversed)` : card.name;
      const cardAppearance = CARD_APPEARANCE_TEMPLATES[templateIndex](cardName, shortPhrase);
      paragraph += cardAppearance + ' ';
      const interpretation = card.reversed && card.reversed_interpretation ? card.reversed_interpretation : card.lunar_interpretation;
      paragraph += interpretation + ' ';
      
      // Add yes/no interpretation if requested
      if (includeYesNo) {
        const yesNoAnswer = getYesNoAnswer(card.id, archetype, rng || undefined);
        if (yesNoAnswer) {
          const yesNoPhrase = getRandomPhrase(yesNoAnswer.phrases, rng || undefined);
          paragraph += `${yesNoAnswer.interpretation} ${yesNoPhrase} `;
        }
      }
      
      const insight = card.reversed && card.reversed_insight ? card.reversed_insight : card.insight;
      paragraph += insight + ' ';
      paragraph += finale;
      
      paragraphs.push(paragraph);
    }
    
    return paragraphs.join('\n\n');
  }

  // Multi-card reading with position labels
  const positionLabels = cards.length === 3 ? ['Past', 'Present', 'Future'] : [];
  
  // Add opening intro for the entire reading
  if (cards.length > 0) {
    const firstArchetype = cards[0].narrative_archetype;
    const firstTransitions = NARRATIVES.transitions[firstArchetype as keyof typeof NARRATIVES.transitions];
    if (firstTransitions) {
      const intro = getRandomPhrase(firstTransitions.intro, rng || undefined);
      paragraphs.push(intro);
    }
  }

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const archetype = card.narrative_archetype;
    const transitions = NARRATIVES.transitions[archetype as keyof typeof NARRATIVES.transitions];

    if (!transitions) continue;

    let paragraph = '';

    // Add position label for 3-card spread
    if (positionLabels[i]) {
      paragraph += `**${positionLabels[i]}:** `;
    }

    // Add card-specific content
    const shortPhrases = card.reversed && card.reversed_phrases ? card.reversed_phrases : card.short_phrases;
    const shortPhrase = getRandomPhrase(shortPhrases, rng || undefined);
    const templateIndex = Math.floor((rng ? rng.next() : Math.random()) * CARD_APPEARANCE_TEMPLATES.length);
    const cardName = card.reversed ? `${card.name} (Reversed)` : card.name;
    const cardAppearance = CARD_APPEARANCE_TEMPLATES[templateIndex](cardName, shortPhrase);
    paragraph += cardAppearance + ' ';
    
    // Add interpretation (reversed or upright)
    const interpretation = card.reversed && card.reversed_interpretation ? card.reversed_interpretation : card.lunar_interpretation;
    paragraph += interpretation + ' ';

    // Add insight (reversed or upright)
    const insight = card.reversed && card.reversed_insight ? card.reversed_insight : card.insight;
    paragraph += insight + ' ';

    // Transition to next card or finale
    if (i < cards.length - 1) {
      const nextCard = cards[i + 1];
      const relationship = getRelationship(archetype, nextCard.narrative_archetype);
      
      let transitionPhrase = '';
      if (relationship === 'reinforcement') {
        transitionPhrase = getRandomPhrase(transitions.reinforcement, rng || undefined);
      } else if (relationship === 'contrast') {
        transitionPhrase = getRandomPhrase(transitions.contrast, rng || undefined);
      } else {
        transitionPhrase = getRandomPhrase(transitions.between_cards, rng || undefined);
      }
      
      paragraph += transitionPhrase;
    } else {
      // Last card: finale
      const finale = getRandomPhrase(transitions.finale, rng || undefined);
      paragraph += finale;
    }

    paragraphs.push(paragraph);
  }

  return paragraphs.join('\n\n');
}

// Generate a complete reading
export function generateReading(cardCount: 1 | 3, seed?: number): Reading {
  const actualSeed = seed ?? Date.now();
  const cards = drawCards(cardCount, actualSeed);
  const isYesNo = cardCount === 1;
  const narrative = generateNarrative(cards, actualSeed, isYesNo);

  const reading: Reading = {
    cards,
    narrative,
    seed: actualSeed
  };

  // Add yes/no answer for single card readings
  if (isYesNo && cards.length > 0) {
    const rng = new SeededRandom(actualSeed);
    reading.yesNoAnswer = getYesNoAnswer(cards[0].id, cards[0].narrative_archetype, rng) || undefined;
  }

  return reading;
}

// Export reading as text
export function exportReadingAsText(reading: Reading): string {
  let text = '═══════════════════════════════════════\n';
  text += '        LUNAR ARCANUM READING\n';
  text += '═══════════════════════════════════════\n\n';
  
  text += `Cards Drawn: ${reading.cards.length}\n`;
  if (reading.seed) {
    text += `Reading Seed: ${reading.seed}\n`;
  }
  text += '\n';

  // Add yes/no answer if present
  if (reading.yesNoAnswer) {
    text += '───────────────────────────────────────\n';
    text += '            YOUR ANSWER\n';
    text += '───────────────────────────────────────\n\n';
    text += `Answer: ${reading.yesNoAnswer.answer.toUpperCase()}\n\n`;
    text += `Context:\n`;
    text += `  Love: ${reading.yesNoAnswer.context.love}\n`;
    text += `  Family: ${reading.yesNoAnswer.context.family}\n`;
    text += `  Work: ${reading.yesNoAnswer.context.work}\n\n`;
  }

  text += '───────────────────────────────────────\n';
  text += '              THE CARDS\n';
  text += '───────────────────────────────────────\n\n';

  reading.cards.forEach((card, index) => {
    text += `${index + 1}. ${card.title}\n`;
    text += `   "${card.short_phrases[0]}"\n`;
    text += `   Insight: ${card.insight}\n\n`;
  });

  text += '───────────────────────────────────────\n';
  text += '            THE NARRATIVE\n';
  text += '───────────────────────────────────────\n\n';

  text += reading.narrative.replace(/\*\*/g, '') + '\n\n';

  text += '═══════════════════════════════════════\n';
  
  return text;
}
