import { useState } from 'react'
import Home from './components/Home'
import Meditation from './components/Meditation'
import Reading from './components/Reading'
import CardGallery from './components/CardGallery'

type View = 'home' | 'meditation' | 'reading' | 'gallery'

function App() {
  const [view, setView] = useState<View>('home')
  const [cardCount, setCardCount] = useState<1 | 3>(3)
  const [skipMeditation, setSkipMeditation] = useState(false)

  const handleStartReading = (count: 1 | 3, skip: boolean) => {
    setCardCount(count)
    setSkipMeditation(skip)
    if (skip) {
      setView('reading')
    } else {
      setView('meditation')
    }
  }

  const handleMeditationComplete = () => {
    setView('reading')
  }

  const handleViewGallery = () => {
    setView('gallery')
  }

  const handleBack = () => {
    setView('home')
  }

  return (
    <>
      {view === 'home' && (
        <Home onStartReading={handleStartReading} onViewGallery={handleViewGallery} />
      )}
      {view === 'meditation' && (
        <Meditation cardCount={cardCount} onComplete={handleMeditationComplete} />
      )}
      {view === 'reading' && (
        <Reading cardCount={cardCount} onBack={handleBack} />
      )}
      {view === 'gallery' && (
        <CardGallery onBack={handleBack} />
      )}
    </>
  )
}

export default App
