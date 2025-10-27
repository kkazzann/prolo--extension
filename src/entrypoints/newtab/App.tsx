import { createRoot } from 'react-dom/client';
import Home from './Home.tsx';

function App() {
  return <Home />;
}

const root = createRoot(document.getElementById('root')!).render(<App />);
