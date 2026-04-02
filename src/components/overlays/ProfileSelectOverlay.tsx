import React, {useState} from 'react';
import {useStore, type StudentProfile, type EducationLevel} from '../../store/useStore';
import {useNavigate} from 'react-router-dom';
import {CheckCircle, Plus, LogOut, ArrowLeft, User} from 'lucide-react';
import '../../styles/profile-select.css';
import {AVATARS, avatarUrl} from "../../hooks/Packages.ts";

const ROUTES: Record<EducationLevel, string> = {
    lower_primary: '/home',
    middle_school: '/home',
    senior_school: '/home',
};

const gradeToLevel = (grade: number): EducationLevel =>
    grade <= 3 ? 'lower_primary' : grade <= 9 ? 'middle_school' : 'senior_school';

const GRADES = Array.from({ length: 12 }, (_, i) => i + 1);

const GRADE_COLORS: Record<EducationLevel, { color: string; bg: string }> = {
    lower_primary: { color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
    middle_school: { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
    senior_school: { color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
};

const MAX_STUDENTS: Record<string, number> = {
    solo: 1, trio: 3, quad: 4, family: 9,
};

const ProfileSelectOverlay: React.FC = () => {
    const {user, setOverlay, setActiveProfile, updateUser, logout, setLevelSelection} = useStore();
    const navigate = useNavigate();

    const [adding, setAdding] = useState(false);
    const [newName, setNewName] = useState('');
    const [newGrade, setNewGrade] = useState<number | null>(null);
    const [addError, setAddError] = useState('');

    if (!user) return null;

    const maxProfiles = MAX_STUDENTS[user.package] ?? 1;
    const canAddMore = user.profiles.length < maxProfiles;

    const handleSelect = (profile: StudentProfile) => {
        setActiveProfile(profile.id);
        setOverlay(null);
        const g = profile.grade;
        if (profile.educationLevel === 'lower_primary') {
            setLevelSelection('lower_primary', { grade: g });
        } else if (profile.educationLevel === 'senior_school') {
            setLevelSelection('senior_school', { grade: String(g) });
        } else if (profile.educationLevel === 'middle_school') {
            const schoolLevel = g <= 6 ? 'Upper Primary' : 'Junior Secondary School';
            setLevelSelection('middle_school', { level: schoolLevel, className: `Grade ${g}` });
        }
        navigate(ROUTES[profile.educationLevel]);
    };

    const handleAddProfile = () => {
        setAddError('');
        if (!newName.trim()) { setAddError('Please enter a name'); return; }
        if (!newGrade) { setAddError('Please select a grade'); return; }

        const newProfile: StudentProfile = {
            id: `${user.phone}-${user.profiles.length}`,
            username: newName.trim(),
            educationLevel: gradeToLevel(newGrade),
            grade: newGrade,
            pin: user.pin,
            avatar: AVATARS[8],
            xp: 0, level: 1, streak: 0, points: 0,
        };

        updateUser({profiles: [...user.profiles, newProfile]});
        setAdding(false);
        setNewName('');
        setNewGrade(null);
    };

    return (
        <div className="ps-backdrop">
            <div className="ps-logo">Bongo<span>Quiz</span></div>

            {!adding ? (
                <div className="ps-screen">
                    <div className="ps-header">
                        <h1 className="ps-heading">Who's learning today?</h1>
                        <p className="ps-subheading">Select your profile to continue</p>
                    </div>

                    <div className="ps-profiles-grid">
                        {user.profiles.map(profile => (
                            <button key={profile.id} className="ps-profile-card" onClick={() => handleSelect(profile)}>
                                <div className="ps-avatar"><img src={avatarUrl(profile.avatar)} alt={profile.username} width={40} height={40}/></div>
                                <span className="ps-profile-name">{profile.username}</span>
                                <span className="ps-profile-level">Grade {profile.grade}</span>
                            </button>
                        ))}

                        {canAddMore && (
                            <button className="ps-profile-card ps-add-card" onClick={() => setAdding(true)}>
                                <div className="ps-avatar ps-add-avatar"><Plus size={30}/></div>
                                <span className="ps-profile-name">Add Profile</span>
                                <span className="ps-profile-level">{user.profiles.length}/{maxProfiles} slots used</span>
                            </button>
                        )}
                    </div>

                    <button className="ps-logout-btn" onClick={() => { logout(); setOverlay(null); navigate('/'); }}>
                        <LogOut size={15}/> Sign Out
                    </button>
                </div>
            ) : (
                <div className="pas-add-screen-container">
                    <div className="ps-add-screen">
                        <div className="ps-add-header">
                            <div className="ps-add-icon"><User size={22}/></div>
                            <h2 className="ps-heading" style={{fontSize: '1.6rem'}}>New Profile</h2>
                            <p className="ps-subheading">Customize and set up a learner profile</p>
                        </div>

                        {addError && <p className="ps-add-error">{addError}</p>}

                        <div className="ps-section" style={{width: '100%'}}>
                            <label className="ps-section-label">Student name</label>
                            <input
                                className="ps-add-input"
                                placeholder="e.g. Amara, Kofi, Zuri…"
                                autoFocus
                                value={newName}
                                onChange={e => { setNewName(e.target.value); setAddError(''); }}
                            />
                        </div>

                        <div className="ps-section" style={{width: '100%'}}>
                            <label className="ps-section-label">Education level</label>
                            <div className="ps-grade-grid">
                                {GRADES.map(g => {
                                    const lvl = gradeToLevel(g);
                                    const { color, bg } = GRADE_COLORS[lvl];
                                    const selected = newGrade === g;
                                    return (
                                        <button
                                            key={g}
                                            className={`ps-grade-cell ${selected ? 'selected' : ''}`}
                                            style={selected ? { borderColor: color, background: bg, color } : {}}
                                            onClick={() => { setNewGrade(g); setAddError(''); }}
                                        >
                                            {selected && <CheckCircle size={12} className="ps-grade-check" />}
                                            <span>Grade {g}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <button className="ps-pin-submit" onClick={handleAddProfile}>Create Profile</button>
                        {user.profiles.length > 0 && (
                            <button className="ps-back-link" onClick={() => { setAdding(false); setAddError(''); }}>
                                <ArrowLeft size={14}/> Back to profiles
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileSelectOverlay;
