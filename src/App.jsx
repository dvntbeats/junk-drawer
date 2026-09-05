import { useMemo, useState } from 'react';
import { packs } from './data/packs';
import './App.css';

const CATEGORIES = ['All', ...new Set(packs.map((p) => p.category))];

export default function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return packs.filter((p) => {
      const matchesCategory = category === 'All' || p.category === category;
      if (!matchesCategory) return false;
      if (!q) return true;
      const haystack = `${p.name} ${p.style} ${p.contents} ${p.category}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [query, category]);

  const totalSamples = packs.reduce((sum, p) => sum + (p.sampleCount || 0), 0);

  return (
    <div className="page">
      <div className="container">
        <header className="header">
          <div className="title-row">
            <h1 className="title">
              THE JUNK DRAWER<span className="title-cursor">_</span>
            </h1>
          </div>
          <div className="tagline">free samples</div>
          <div className="stats-row">
            <span>
              <strong>{packs.length}</strong> packs indexed
            </span>
            <span>
              <strong>{totalSamples.toLocaleString()}</strong> samples total
            </span>
            <span>growing toward 100+</span>
          </div>
        </header>

        <div className="controls">
          <input
            className="search-input"
            type="text"
            placeholder="search by name, style, or contents..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`chip${category === c ? ' active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="table-head">
          <div>Name</div>
          <div>Category</div>
          <div>Contents</div>
          <div style={{ textAlign: 'right' }}>Size</div>
          <div />
        </div>

        <div className="rows">
          {filtered.length === 0 && <div className="empty-state">No packs match that search.</div>}
          {filtered.map((p) => (
            <div className="row" key={p.id}>
              <div className="cell-name">
                <span className="pack-name">{p.name}</span>
                <div className="pack-style">{p.style}</div>
              </div>
              <div className="cell-category">
                <span className="category-badge">{p.category}</span>
              </div>
              <div className="cell-contents">{p.contents}</div>
              <div className="cell-size">
                {p.sizeLabel}
                <div className="cell-format">{p.format}</div>
              </div>
              <div>
                <a
                  className="download-btn"
                  href={p.url}
                  target={p.source === 'external' ? '_blank' : undefined}
                  rel={p.source === 'external' ? 'noopener' : undefined}
                  download={p.source === 'hosted' ? true : undefined}
                >
                  {p.source === 'external' ? 'GET ↗' : 'DOWNLOAD'}
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="footer-note">
          Every entry here is verified as a direct, gate-free download at the time it's added — no email capture, no
          "create an account to unlock." Not everything you sample from these is automatically clear for commercial
          release, so do your own research before you drop it in a track you plan to sell.
        </div>
      </div>
    </div>
  );
}
