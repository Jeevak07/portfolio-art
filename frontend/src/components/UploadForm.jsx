export default function UploadForm({
  adminMode,
  uploading,
  uploadError,
  onUpload,
  onAdminLogin,
  onAdminLogout,
}) {
  return (
    <div className="rounded-3xl p-8 glass">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="section-subtitle text-xs uppercase text-ink/50">Studio</p>
          <h2 className="mt-3 font-display text-4xl tracking-[0.08em]">Upload New Work</h2>
          <p className="mt-2 text-sm text-ink/60">
            Use this panel to add new drawings. Images are stored in the Python backend.
          </p>
        </div>
        <div className="chip rounded-full px-5 py-2 text-xs uppercase tracking-[0.3em] text-ink/70">
          Admin Only
        </div>
      </div>

      {adminMode ? (
        <>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#1b1b20]/80 px-4 py-3 text-sm">
            <span>Admin mode enabled</span>
            <button
              className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em]"
              onClick={onAdminLogout}
            >
              Logout
            </button>
          </div>
          <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={onUpload}>
            <input
              className="rounded-2xl border border-white/10 bg-[#1b1b20] px-4 py-3 text-sm text-ink placeholder:text-ink/40"
              name="title"
              placeholder="Artwork title"
              required
            />
            <input
              className="rounded-2xl border border-white/10 bg-[#1b1b20] px-4 py-3 text-sm text-ink placeholder:text-ink/40"
              name="tag"
              placeholder="Tag (Anime, Portrait...)"
            />
            <input
              className="rounded-2xl border border-white/10 bg-[#1b1b20] px-4 py-3 text-sm text-ink placeholder:text-ink/40"
              name="year"
              placeholder="Year"
            />
            <input
              className="rounded-2xl border border-white/10 bg-[#1b1b20] px-4 py-3 text-sm text-ink"
              name="image"
              type="file"
              accept="image/*"
              required
            />
            <textarea
              className="md:col-span-2 rounded-2xl border border-white/10 bg-[#1b1b20] px-4 py-3 text-sm text-ink placeholder:text-ink/40"
              name="description"
              placeholder="Short description"
              rows={3}
            />
            <div className="md:col-span-2 flex flex-wrap items-center gap-4">
              <button
                className="btn-animate button-primary w-full rounded-full px-6 py-3 text-xs uppercase tracking-[0.3em] sm:w-auto"
                type="submit"
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload Artwork'}
              </button>
              {uploadError && <p className="text-sm text-ember">{uploadError}</p>}
            </div>
          </form>
        </>
      ) : (
        <form className="mt-8 flex flex-wrap items-center gap-4" onSubmit={onAdminLogin}>
          <input
            className="min-w-[220px] rounded-2xl border border-white/10 bg-[#1b1b20] px-4 py-3 text-sm text-ink placeholder:text-ink/40"
            name="adminKey"
            type="password"
            placeholder="Enter admin key"
          />
          <button
            className="btn-animate button-primary w-full rounded-full px-6 py-3 text-xs uppercase tracking-[0.3em] sm:w-auto"
            type="submit"
          >
            Unlock
          </button>
          {uploadError && <p className="text-sm text-ember">{uploadError}</p>}
        </form>
      )}
    </div>
  );
}
