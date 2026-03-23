import React, { useState } from 'react';
import { useGameStore, type FilterTag, type Game } from '../store/useGameStore';
import { useGame } from '../hooks/useGame';
import { Gamepad2, Star, Lock, Play } from 'lucide-react';
import '../styles/games.css';

const FILTERS: { id: FilterTag; label: string; emoji: string }[] = [
  { id: 'all',          label: 'All Games',   emoji: '🎮' },
  { id: 'hot',          label: 'Hot 🔥',      emoji: '🔥' },
  { id: 'popular',      label: 'Popular',     emoji: '⭐' },
  { id: 'new',          label: 'New',         emoji: '✨' },
  { id: 'coming_soon',  label: 'Coming Soon', emoji: '🚀' },
];

/* ─── Game card ──────────────────────────────────────────── */
const GameCard: React.FC<{ game: Game }> = ({ game }) => {
  const { launchGame, isComingSoon, isNew, isHot, getTagLabel } = useGame();
  const [hovered, setHovered] = useState(false);

  const comingSoon = isComingSoon(game);
  const newBadge = isNew(game);
  const hotBadge = isHot(game);

  // Pick the most important tag for badge
  const badgeTag = hotBadge ? 'hot' : newBadge ? 'new' : game.tags.includes('popular') ? 'popular' : null;
  const badge = badgeTag ? getTagLabel(badgeTag) : null;

  return (
    <div
      className={`gc-card ${comingSoon ? 'gc-card-locked' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => launchGame(game.id)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && launchGame(game.id)}
    >
      {/* Card thumbnail */}
      <div className="gc-thumb" style={{ background: game.bgColor }}>
        <span className="gc-emoji">{game.emoji}</span>

        {/* Badge */}
        {badge && (
          <span className="gc-badge" style={{ background: badge.bg }}>
            {badge.label}
          </span>
        )}

        {/* Hover overlay */}
        {!comingSoon && (
          <div className={`gc-hover-overlay ${hovered ? 'visible' : ''}`}>
            <button className="gc-play-btn">
              <Play size={20} fill="white" color="white" />
              Play Now
            </button>
          </div>
        )}

        {/* Coming soon lock */}
        {comingSoon && (
          <div className="gc-lock-overlay">
            <Lock size={28} color="rgba(255,255,255,0.8)" />
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="gc-body">
        <div className="gc-title-row">
          <h3 className="gc-title">{game.name}</h3>
          {!comingSoon && game.rating > 0 && (
            <span className="gc-rating">
              <Star size={12} fill="#f59e0b" color="#f59e0b" />
              {game.rating}
            </span>
          )}
        </div>

        {/*<p className="gc-desc">{game.description}</p>*/}

        {/*<div className="gc-meta">*/}
          {/*{!comingSoon ? (*/}
          {/*  <>*/}
          {/*    /!*<span className="gc-meta-item">*!/*/}
          {/*    /!*  <Users size={12} />*!/*/}
          {/*    /!*  {formatPlayers(game.players)}*!/*/}
          {/*    /!*</span>*!/*/}
          {/*    /!*<span className="gc-meta-item">*!/*/}
          {/*    /!*  <Clock size={12} />*!/*/}
          {/*    /!*  {game.duration}*!/*/}
          {/*    /!*</span>*!/*/}
          {/*    /!*<span className="gc-meta-item gc-xp">*!/*/}
          {/*    /!*  <Zap size={12} />*!/*/}
          {/*    /!*  +{game.xpReward} XP*!/*/}
          {/*    /!*</span>*!/*/}
          {/*  </>*/}
          {/*) : (*/}
          {/*  <span className="gc-meta-item gc-coming">*/}
          {/*    🚀 Coming Soon*/}
          {/*  </span>*/}
          {/*)}*/}
        {/*</div>*/}
      </div>
    </div>
  );
};

/* ─── Main Page ──────────────────────────────────────────── */
const GamesPage: React.FC = () => {
  const { activeFilter, setFilter, filteredGames } = useGameStore();
  const games = filteredGames();

  const hotCount = useGameStore.getState().games.filter(g => g.tags.includes('hot')).length;
  const newCount = useGameStore.getState().games.filter(g => g.tags.includes('new')).length;

  return (
    <div className="gp-root">
      {/* Hero */}
      <div className="gp-hero">
        <div className="gp-hero-bg" />
        <div className="gp-hero-content">
          <div className="gp-hero-badge">
            <Gamepad2 size={16} />
            Learning through Play
          </div>
          <h1 className="gp-hero-title">
            Game <span>Zone</span>
            <span className="gp-hero-title-emoji"> 🎮</span>
          </h1>
          <p className="gp-hero-sub">
            Earn XP, unlock achievements and master CBC subjects — one game at a time.
          </p>

          <div className="gp-hero-stats">
            <div className="gp-hero-stat">
              <span className="gp-hs-val">{useGameStore.getState().games.length}</span>
              <span className="gp-hs-lbl">Games</span>
            </div>
            <div className="gp-hero-stat">
              <span className="gp-hs-val">{hotCount} 🔥</span>
              <span className="gp-hs-lbl">Trending</span>
            </div>
            <div className="gp-hero-stat">
              <span className="gp-hs-val">{newCount} ✨</span>
              <span className="gp-hs-lbl">New</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="gp-filter-wrap">
        <div className="gp-filter-bar">
          {FILTERS.map(f => (
            <button
              key={f.id}
              className={`gp-filter-btn ${activeFilter === f.id ? 'active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.emoji} {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Games grid */}
      <div className="gp-content">
        {games.length === 0 ? (
          <div className="gp-empty">
            <span>🎮</span>
            <p>No games in this category yet. Check back soon!</p>
          </div>
        ) : (
          <div className="gp-grid">
            {games.map(game => <GameCard key={game.id} game={game} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default GamesPage;
