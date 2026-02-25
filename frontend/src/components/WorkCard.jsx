import { classNames } from '../utils/constants';

export default function WorkCard({ work, selectedWorkId, onSelect }) {
  return (
    <button className="group text-left" onClick={() => onSelect(work)}>
      <div
        className={classNames(
          'overflow-hidden rounded-3xl glass-soft hover-lift',
          selectedWorkId === work.id ? 'ring-2 ring-ember/80 shadow-glow' : ''
        )}
      >
        <div className="relative h-[26rem] w-full">
          <img
            src={work.imageUrl}
            alt={work.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-90 transition duration-500 group-hover:opacity-60" />
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-ink/50">
            <span>{work.tag || 'Sketch'}</span>
            <span>{work.year || '2025'}</span>
          </div>
          <h3 className="mt-3 text-lg font-semibold text-ink">{work.title}</h3>
          <p className="mt-2 text-sm text-ink/60">{work.description}</p>
        </div>
      </div>
    </button>
  );
}
