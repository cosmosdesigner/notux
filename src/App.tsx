import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Note } from './pages/Note';

export function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notes/:id" element={<Note />} />
          <Route path="/notes/edit/:id" element={<Note />} />
        </Routes>
      </div>
    </Router>
  );
}