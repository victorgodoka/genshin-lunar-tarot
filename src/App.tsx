import { useState, useEffect } from 'react'
import Home from './components/Home'
import Meditation from './components/Meditation'
import Reading from './components/Reading'
import CardGallery from './components/CardGallery'
import { generateReading, type Reading as ReadingType } from './utils/narrativeEngine'

type View = 'home' | 'meditation' | 'reading' | 'gallery'

function App() {
  const [view, setView] = useState<View>('home')
  const [cardCount, setCardCount] = useState<1 | 3>(3)
  const [sharedReading, setSharedReading] = useState<ReadingType | null>(null)

  const handleStartReading = (count: 1 | 3, skip: boolean) => {
    setCardCount(count)
    setSharedReading(null) // Clear any shared reading
    if (skip) {
      setView('reading')
    } else {
      setView('meditation')
    }
  }

  const handleMeditationComplete = () => {
    setSharedReading(null) // Clear any shared reading when starting fresh
    setView('reading')
  }

  const handleNewReadingWithMeditation = () => {
    setSharedReading(null) // Clear shared reading
    setView('meditation')
  }


  const handleViewGallery = () => {
    setView('gallery')
  }

  const handleBack = () => {
    setSharedReading(null) // Clear shared reading when going back
    setView('home')
  }

  // Handle URL parameters for shared readings
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const seedParam = urlParams.get('seed')
    const countParam = urlParams.get('count')

    if (seedParam && countParam) {
      const seed = parseInt(seedParam, 10)
      const count = parseInt(countParam, 10) as 1 | 3

      if (!isNaN(seed) && (count === 1 || count === 3)) {
        const reading = generateReading(count, seed)
        setSharedReading(reading)
        setCardCount(count)
        setView('reading')

        // Clean up URL without refreshing the page
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: 'url(background.png)' }}>
      {/* Background overlay for opacity control */}
      <div className="absolute inset-0 bg-black/90"></div>

      {/* Content with relative positioning to appear above background */}
      <div className="relative z-10">
        {view === 'home' && (
          <Home onStartReading={handleStartReading} onViewGallery={handleViewGallery} />
        )}
        {view === 'meditation' && (
          <Meditation cardCount={cardCount} onComplete={handleMeditationComplete} />
        )}
        {view === 'reading' && (
          <Reading
            cardCount={cardCount}
            onBack={handleBack}
            onNewReadingWithMeditation={handleNewReadingWithMeditation}
            sharedReading={sharedReading}
          />
        )}
        {view === 'gallery' && (
          <CardGallery onBack={handleBack} />
        )}
      </div>
    </div>
  )
}

export default App
