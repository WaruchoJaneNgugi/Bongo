import React, { useState, useMemo } from 'react';
import { useGameStore, type FilterTag, type Game } from '../store/useGameStore';
import { Gamepad2, Lock } from 'lucide-react';
import '../styles/games.css';
import '../styles/games-filter.css';
import '../styles/games-grid.css';
import { useGame } from '../hooks/useGame.ts';

const FILTERS: { id: FilterTag; label: string; emoji: string; color: string }[] = [
  { id: 'all', label: 'All Games', emoji: '🎮', color: '#00f5d4' },
  { id: 'latest', label: 'New', emoji: '✨', color: '#ff3cac' },
  { id: 'timed', label: 'Timed Trivia', emoji: '⏱️', color: '#f5a623' },
  { id: 'popular', label: 'Hot', emoji: '🔥', color: '#ff4757' },
  { id: 'quiz', label: 'Quizzes', emoji: '🧠', color: '#7b2fff' },
  { id: 'puzzle', label: 'Puzzle', emoji: '🧩', color: '#26de81' },
  { id: 'arcade', label: 'Arcade', emoji: '👾', color: '#ff6b6b' },
  { id: 'coming_soon', label: 'Coming Soon', emoji: '🚀', color: '#f5a623' },
];

const GamesPage: React.FC = () => {
  const { activeFilter, setFilter, games: allGames } = useGameStore();
  const { launchGame, isComingSoon, isNew, isHot, getTagLabel } = useGame();

  // Manual filtering based on activeFilter
  const games = useMemo(() => {
    if (activeFilter === 'all') return allGames;

    const filterMap: Record<string, string[]> = {
      latest: ['new', 'latest'],
      timed: ['timed'],
      popular: ['hot', 'popular'],
      quiz: ['quiz'],
      puzzle: ['puzzle'],
      arcade: ['arcade'],
      coming_soon: ['coming_soon'],
    };

    const targetTags = filterMap[activeFilter] || [];
    return allGames.filter(game =>
        game.tags?.some(tag => targetTags.includes(tag))
    );
  }, [activeFilter, allGames]);

  const hotCount = allGames.filter(g => g.tags?.includes('hot')).length;
  const newCount = allGames.filter(g => g.tags?.includes('new')).length;

  // Image loading states
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handleImageLoad = (gameId: string | number) => {
    setLoadedImages(prev => ({ ...prev, [String(gameId)]: true }));
  };

  const handleImageError = (gameId: string | number) => {
    setFailedImages(prev => ({ ...prev, [String(gameId)]: true }));
  };

  const shouldShowShimmer = (game: Game) => {
    return !loadedImages[String(game.id)] && !failedImages[String(game.id)];
  };

  // const hasTag = (game: Game, tagName: string): boolean => {
  //   return game.tags?.includes(tagName) || false;
  // };

  // Helper to get badge from getTagLabel (hot, new, popular)
  const getTagBadge = (game: Game) => {
    if (isHot(game)) return getTagLabel('hot');
    if (isNew(game)) return getTagLabel('new');
    if (game.tags?.includes('popular')) return getTagLabel('popular');
    return null;
  };

  return (
      <div className="gp-root">
        {/* Hero Section */}
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
                <span className="gp-hs-val">{allGames.length}</span>
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

        {/* Category Filter */}
        <div className="mobile-categories">
          <div className="mobile-categories-header">
            <span className="mobile-header-label">BROWSE</span>
            <div className="mobile-header-glow" />
          </div>
          <div className="mobile-categories-scroll">
            {FILTERS.map((category) => (
                <div
                    key={category.id}
                    className={`mobile-category-chip ${activeFilter === category.id ? 'active-game-cat' : ''}`}
                    onClick={() => setFilter(category.id)}
                    style={{
                      '--chip-color': category.color,
                      '--chip-glow': `${category.color}40`,
                    } as React.CSSProperties}
                >
                  <span className="chip-icon">{category.emoji}</span>
                  <span className="chip-label">{category.label}</span>
                  {category.id === 'popular' && <span className="chip-hot">🔥</span>}
                </div>
            ))}
          </div>
        </div>

        {/* Games Grid */}
        <div className="games-grid-card">
          {games.length > 0 ? (
              games.map((game) => {
                const comingSoon = isComingSoon(game);
                const badge = getTagBadge(game);
                // const hasFeatured = hasTag(game, 'featured');
                // const hasSoon = hasTag(game, 'soon');

                return (
                    <div
                        className={`main-game-card ${comingSoon ? 'coming-soon' : ''}`}
                        key={game.id}
                        onClick={() => !comingSoon && launchGame(game.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => !comingSoon && e.key === 'Enter' && launchGame(game.id)}
                    >
                      <div className="game-card-image-container">
                        {/* Standard badges from useGame */}
                        {badge && (
                            // <div className="game-tag-hot" style={{ background: badge.bg }}>
                             <div className="game-tag-hot" >
                               {/*<span className="tag-dot">⬤</span>*/}
                               <span className="tag-text">{badge.label}</span>
                             </div>

                        )}

                        {/* Manual tags for featured / soon (if needed) */}
                        {/*{hasFeatured && !badge && (*/}
                        {/*    <div className="game-tag-featured">*/}
                        {/*      /!*<span className="tag-dot-featured">⬤</span>*!/*/}
                        {/*      <span className="tag-text-featured">Featured</span>*/}
                        {/*    </div>*/}
                        {/*)}*/}
                        {/*{hasSoon && !badge && !comingSoon && (*/}
                        {/*    <div className="game-tag-soon">*/}
                        {/*      /!*<span className="tag-dot-soon">⬤</span>*!/*/}
                        {/*      <span className="tag-text-soon">upcoming</span>*/}
                        {/*    </div>*/}
                        {/*)}*/}

                        {/* Shimmer while loading */}
                        {shouldShowShimmer(game) && (
                            <div className="shimmer-wrapper">
                              <div className="shimmer-effect" />
                              <div className="shimmer-content">
                                <div className="shimmer-icon">🎮</div>
                                <div className="shimmer-title">{game.name}</div>
                              </div>
                            </div>
                        )}

                        {/* Actual image */}
                        {game.image && !failedImages[String(game.id)] && (
                            <img
                                src={game.image}
                                alt={game.name}
                                className="grid-game-card-image"
                                style={{
                                  opacity: loadedImages[String(game.id)] ? 1 : 0,
                                  transition: 'opacity 0.4s ease-in-out',
                                }}
                                loading="lazy"
                                onLoad={() => handleImageLoad(game.id)}
                                onError={() => handleImageError(game.id)}
                            />
                        )}

                        {/* Title overlay */}
                        <div className="game-card-title-overlay">{game.name}</div>

                        {/* Lock overlay for coming soon */}
                        {comingSoon && (
                            <div className="gc-lock-overlay">
                              <Lock size={28} color="rgba(255,255,255,0.8)" />
                            </div>
                        )}
                      </div>

                      {/* Hover play button (only if not coming soon) */}
                      {!comingSoon && (
                          <div className="game-card-hover">
                            <div className="play-button">
                              <svg height="60px" width="60px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                  <linearGradient id="playButtonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#00C9FF" />
                                    <stop offset="100%" stopColor="#92FE9D" />
                                  </linearGradient>
                                </defs>
                                <circle cx="256" cy="256" r="256" fill="url(#playButtonGradient)" />
                                <path d="M208 160L352 256L208 352V160Z" fill="#000000" />
                              </svg>
                            </div>
                          </div>
                      )}
                    </div>
                );
              })
          ) : (
              <div className="no-results-message">
                <div className="no-results-icon">🎮</div>
                <h3>No Games Found</h3>
                <p>Try adjusting your filters or check back later for new games!</p>
              </div>
          )}
        </div>
      </div>
  );
};

export default GamesPage;