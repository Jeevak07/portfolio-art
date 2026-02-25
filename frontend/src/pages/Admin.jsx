import { useState } from 'react';
import Gallery from './Gallery';
import UploadForm from '../components/UploadForm';
import { deleteWork, uploadWork, verifyAdmin } from '../services/api';
import { useWorks } from '../hooks/useWorks';

export default function Admin() {
  const { loading, loadError, tags, activeTag, setActiveTag, filteredWorks, setWorks } = useWorks();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem('adminKey') || '');
  const [adminMode, setAdminMode] = useState(() => Boolean(sessionStorage.getItem('adminKey')));

  async function handleAdminLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const key = formData.get('adminKey');
    if (!key || !String(key).trim()) {
      setUploadError('Enter admin key.');
      return;
    }

    const trimmed = String(key).trim();
    setUploadError('');

    try {
      await verifyAdmin(trimmed);
      sessionStorage.setItem('adminKey', trimmed);
      setAdminKey(trimmed);
      setAdminMode(true);
      event.currentTarget.reset();
    } catch {
      setUploadError('Invalid admin key.');
    }
  }

  function handleAdminLogout() {
    sessionStorage.removeItem('adminKey');
    setAdminKey('');
    setAdminMode(false);
  }

  async function handleUpload(event) {
    event.preventDefault();
    setUploadError('');

    const formData = new FormData(event.currentTarget);
    const file = formData.get('image');
    if (!file || !file.name) {
      setUploadError('Please select an image.');
      return;
    }

    try {
      setUploading(true);
      const data = await uploadWork(formData, adminKey);
      setWorks((prev) => [data, ...prev]);
      event.currentTarget.reset();
    } catch {
      setUploadError('Upload failed. Check admin access and backend.');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(workId) {
    if (!adminMode) return;
    try {
      await deleteWork(workId, adminKey);
      setWorks((prev) => prev.filter((item) => item.id !== workId));
    } catch {
      setUploadError('Delete failed. Check admin access and backend.');
    }
  }

  return (
    <>
      <section id="upload" className="mx-auto mt-20 w-full reveal px-6 md:mt-24 md:px-12" data-reveal>
        <UploadForm
          adminMode={adminMode}
          uploading={uploading}
          uploadError={uploadError}
          onUpload={handleUpload}
          onAdminLogin={handleAdminLogin}
          onAdminLogout={handleAdminLogout}
        />
      </section>

      <Gallery
        loading={loading}
        loadError={loadError}
        tags={tags}
        activeTag={activeTag}
        setActiveTag={setActiveTag}
        filteredWorks={filteredWorks}
        adminMode={adminMode}
        onDelete={handleDelete}
      />
    </>
  );
}
