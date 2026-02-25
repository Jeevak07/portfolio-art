import { useState } from 'react';
import Loader from '../components/Loader';
import WorkCard from '../components/WorkCard';
import { classNames } from '../utils/constants';

export default function Gallery({
  loading,
  loadError,
  tags,
  activeTag,
  setActiveTag,
  filteredWorks,
  adminMode,
  onDelete,
}) {
  const [selectedWork, setSelectedWork] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  function requestDelete(workId) {
    setDeleteTarget(workId);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    onDelete(deleteTarget);
    if (selectedWork?.id === deleteTarget) {
      setSelectedWork(null);
    }
    setDeleteTarget(null);
  }

  return (
    <section id="works" className="mx-auto mt-20 w-full reveal px-6 md:mt-24 md:px-12" data-reveal>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="section-subtitle text-xs uppercase text-ink/50">Gallery</p>
          <h2 className="mt-3 font-display text-4xl tracking-[0.08em] md:text-5xl">My Works</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              className={classNames(
                'btn-animate glass-chip rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.28em] transition md:text-xs',
                activeTag === tag ? 'chip-active text-ink shadow-glow' : 'text-ink/70 hover:text-ink'
              )}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loadError && (
            <div className="sm:col-span-2 lg:col-span-3 rounded-2xl border border-white/10 bg-[#121216] p-4 text-sm text-ink/70">
              Backend is offline — connect the server to load your uploads.
            </div>
          )}
          {!loadError && filteredWorks.length === 0 && (
            <div className="sm:col-span-2 lg:col-span-3 rounded-2xl border border-white/10 bg-[#121216] p-6 text-sm text-ink/70">
              No artworks yet. Log in as admin and upload your first drawing.
            </div>
          )}

          {filteredWorks.map((work) => (
            <WorkCard
              key={work.id}
              work={work}
              selectedWorkId={selectedWork?.id}
              onSelect={setSelectedWork}
            />
          ))}
        </div>
      )}

      {selectedWork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
          <button
            className="absolute right-6 top-6 rounded-full border border-white/40 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white"
            onClick={() => setSelectedWork(null)}
          >
            Close
          </button>
          <div className="inline-flex w-fit max-w-[90vw] flex-col items-stretch overflow-hidden rounded-3xl bg-[#121216] shadow-soft">
            <img
              src={selectedWork.imageUrl}
              alt={selectedWork.title}
              className="block h-auto w-auto max-h-[80vh] max-w-[90vw] object-contain bg-transparent"
            />
            <div className="w-full p-6">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-ink/50">
                <span>{selectedWork.tag || 'Sketch'}</span>
                <span>{selectedWork.year || '2025'}</span>
              </div>
              <h3 className="mt-3 text-2xl font-semibold text-ink">{selectedWork.title}</h3>
              <p className="mt-2 text-sm text-ink/70">{selectedWork.description}</p>
              {adminMode && (
                <div className="mt-6">
                  <button
                    className="btn-animate rounded-full border border-red-400/60 px-5 py-2 text-xs uppercase tracking-[0.3em] text-red-300"
                    onClick={() => requestDelete(selectedWork.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-6">
          <div className="glass w-full max-w-md rounded-3xl p-6 text-ink shadow-soft">
            <p className="text-xs uppercase tracking-[0.4em] text-ink/60">Confirm Delete</p>
            <h3 className="mt-3 text-2xl font-semibold">Delete this artwork?</h3>
            <p className="mt-2 text-sm text-ink/70">This will remove the image and its details permanently.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                className="btn-animate button-ghost rounded-full px-5 py-2 text-xs uppercase tracking-[0.3em] text-ink"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                className="btn-animate rounded-full bg-red-500/80 px-5 py-2 text-xs uppercase tracking-[0.3em] text-white"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
