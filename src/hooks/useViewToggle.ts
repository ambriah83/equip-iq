
import { useState } from 'react';

type ViewType = 'card' | 'list';

export function useViewToggle(defaultView: ViewType = 'card') {
  const [view, setView] = useState<ViewType>(defaultView);
  
  const toggleView = () => {
    setView(prev => prev === 'card' ? 'list' : 'card');
  };

  return {
    view,
    setView,
    toggleView,
    isCardView: view === 'card',
    isListView: view === 'list'
  };
}
