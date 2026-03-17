import React from 'react';
import {useStore} from '../../store/useStore';
// import { subjects } from '../../data/quizData';
import heroImg from '/hero.png';

const levelLabel: Record<string, string> = {
    lower_primary: 'Lower Primary',
    middle_school: 'Middle School',
    senior_school: 'Senior School',
};

const DashboardOverlay: React.FC = () => {
    const {user} = useStore();

    // const userSubjects = subjects.filter(
    //   (s) => s.level === user?.educationLevel
    // );
    // const totalQuizzes = results.length;
    // const avgScore =
    //   results.length > 0
    //     ? Math.round(
    //         (results.reduce((acc, r) => acc + r.score / r.total, 0) /
    //           results.length) *
    //           100
    //       )
    //     : 0;
    //
    // const handleSubject = (subjectId: string) => {
    //   setCurrentSubject(subjectId);
    //   setOverlay('subjects');
    // };

    return (
        // <div className="overlay-backdrop" onClick={() => setOverlay(null)}>
        //   <div
        //     className="overlay-card dash-overlay"
        //     onClick={(e) => e.stopPropagation()}
        //   >
        <>


            {/*<button className="overlay-close" onClick={() => setOverlay(null)}>*/}
            {/*    ✕*/}
            {/*</button>*/}

            <div className="dash-header">
                <div>
                    <div className="dash-welcome">
                        Welcome, {user?.username}! 👋
                    </div>
                    <div style={{fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 600, marginTop: 2}}>
                        Ready to revise today?
                    </div>
                </div>
                <div className="dash-level-badge">
                    {levelLabel[user?.educationLevel ?? '']}
                </div>
                <div className="hero-right">
                    <img
                        src={heroImg}
                        alt="Students studying"
                        className="hero-img"
                    />
                </div>
            </div>
        </>
        //     {/* Stats */}
        //     {/*<div className="dash-stats" style={{ marginBottom: 20 }}>*/}
        //     {/*  <div className="dash-stat">*/}
        //     {/*    <div className="dash-stat-num">{totalQuizzes}</div>*/}
        //     {/*    <div className="dash-stat-label">Quizzes Done</div>*/}
        //     {/*  </div>*/}
        //     {/*  <div style={{ width: 1, background: 'rgba(255,255,255,0.2)', margin: '0 8px' }} />*/}
        //     {/*  <div className="dash-stat">*/}
        //     {/*    <div className="dash-stat-num">{avgScore}%</div>*/}
        //     {/*    <div className="dash-stat-label">Avg Score</div>*/}
        //     {/*  </div>*/}
        //     {/*  <div style={{ width: 1, background: 'rgba(255,255,255,0.2)', margin: '0 8px' }} />*/}
        //     {/*  <div className="dash-stat">*/}
        //     {/*    <div className="dash-stat-num">{userSubjects.length}</div>*/}
        //     {/*    <div className="dash-stat-label">Subjects</div>*/}
        //     {/*  </div>*/}
        //     {/*</div>*/}
        //
        //     {/*<p className="dash-section-title">Select a subject to revise:</p>*/}
        //
        //     {/*<div className="subjects-grid">*/}
        //     {/*  {userSubjects.map((subject) => (*/}
        //     {/*    <button*/}
        //     {/*      key={subject.id}*/}
        //     {/*      className="subject-btn"*/}
        //     {/*      onClick={() => handleSubject(subject.id)}*/}
        //     {/*    >*/}
        //     {/*      <div className="subject-btn-icon">{subject.icon}</div>*/}
        //     {/*      <div className="subject-btn-name">{subject.name}</div>*/}
        //     {/*    </button>*/}
        //     {/*  ))}*/}
        //     {/*</div>*/}
        //
        //     {/*{results.length > 0 && (*/}
        //     {/*  <div style={{ marginBottom: 12 }}>*/}
        //     {/*    <p className="dash-section-title">Recent Results:</p>*/}
        //     {/*    {results.slice(0, 3).map((r, i) => (*/}
        //     {/*      <div*/}
        //     {/*        key={i}*/}
        //     {/*        style={{*/}
        //     {/*          display: 'flex',*/}
        //     {/*          justifyContent: 'space-between',*/}
        //     {/*          alignItems: 'center',*/}
        //     {/*          padding: '10px 14px',*/}
        //     {/*          background: 'var(--purple-ultra-pale)',*/}
        //     {/*          borderRadius: 8,*/}
        //     {/*          marginBottom: 6,*/}
        //     {/*          fontSize: '0.85rem',*/}
        //     {/*        }}*/}
        //     {/*      >*/}
        //     {/*        <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>*/}
        //     {/*          {r.subjectName} – {r.topicName}*/}
        //     {/*        </span>*/}
        //     {/*        <span*/}
        //     {/*          style={{*/}
        //     {/*            fontWeight: 800,*/}
        //     {/*            color:*/}
        //     {/*              r.score / r.total >= 0.7*/}
        //     {/*                ? '#16A34A'*/}
        //     {/*                : r.score / r.total >= 0.5*/}
        //     {/*                ? '#D97706'*/}
        //     {/*                : '#DC2626',*/}
        //     {/*          }}*/}
        //     {/*        >*/}
        //     {/*          {r.score}/{r.total}*/}
        //     {/*        </span>*/}
        //     {/*      </div>*/}
        //     {/*    ))}*/}
        //     {/*  </div>*/}
        //     {/*)}*/}
        //
        //
        // {/*  </div>*/}
        // {/*</div>*/}
    );
};

export default DashboardOverlay;
