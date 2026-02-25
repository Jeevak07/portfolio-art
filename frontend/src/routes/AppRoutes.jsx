import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Gallery from '../pages/Gallery';
import Admin from '../pages/Admin';
import { useWorks } from '../hooks/useWorks';

function HomePage() {
  const { loading, loadError, tags, activeTag, setActiveTag, filteredWorks } = useWorks();

  return (
    <>
      <Home />
      <Gallery
        loading={loading}
        loadError={loadError}
        tags={tags}
        activeTag={activeTag}
        setActiveTag={setActiveTag}
        filteredWorks={filteredWorks}
        adminMode={false}
        onDelete={() => {}}
      />
    </>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
