import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, UploadCloud, FileText, X, ImagePlus, AlertCircle, ChevronDown, RotateCcw,
  FileType, Video, Music, Plus, Trash2,
} from 'lucide-react';
import { useSellerStore } from '../../store/useSellerStore';
import { RESOURCE_LEVELS, levelByKey } from '../../lib/marketplace/taxonomy';
import {
  createResource, getResource, updateResource, previewUploadNames,
} from '../../lib/marketplace/resources';
import { saveDraft, loadDraft, clearDraft } from '../../lib/marketplace/formDraft';
import type {
  ResourceLevel, ResourceStatus, ResourceFile,
  ResourceKind, QuizQuestionPublic, QuizAnswer,
} from '../../lib/marketplace/types';

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

type QuizDraft = { prompt: string; options: string[]; correctIndex: number; explanation: string };

const KIND_OPTIONS: { key: ResourceKind; label: string; icon: typeof FileType }[] = [
  { key: 'document', label: 'Document', icon: FileType },
  { key: 'video', label: 'Video', icon: Video },
  { key: 'audio', label: 'Audio', icon: Music },
];

export default function ResourceForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const sellerId = useSellerStore(s => s.sellerId);
  const sellerName = useSellerStore(s => s.seller?.displayName ?? 'Seller');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState<ResourceLevel>('lower_primary');
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [priceKsh, setPriceKsh] = useState(0);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [keptFiles, setKeptFiles] = useState<ResourceFile[]>([]);
  const [removedPaths, setRemovedPaths] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [oldThumbnailPath, setOldThumbnailPath] = useState<string | null>(null);
  const [kind, setKind] = useState<ResourceKind>('document');
  const [media, setMedia] = useState<File | null>(null);
  const [durationSec, setDurationSec] = useState<number | null>(null);
  const [quiz, setQuiz] = useState<QuizDraft[]>([]);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [dragThumb, setDragThumb] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);

  const activeLevel = useMemo(() => levelByKey(level)!, [level]);

  // Draft persistence: survive an accidental refresh with fields + files intact.
  const draftKey = editing ? `edit:${id}` : 'new';
  const hydrated = useRef(false);

  // Switch level and drop grade/subject selections that no longer belong to it.
  function changeLevel(next: ResourceLevel) {
    const lvl = levelByKey(next)!;
    setLevel(next);
    if (grade && !lvl.grades.includes(grade)) setGrade('');
    if (subject && !lvl.subjects.includes(subject)) setSubject('');
  }

  // Hydrate: load the saved resource (edit) first, then overlay any locally-saved
  // draft so an accidental refresh restores unsaved edits and picked files.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (editing && id) {
        const r = await getResource(id);
        if (!cancelled && r) {
          setTitle(r.title); setDescription(r.description);
          setLevel(r.level); setGrade(r.grade); setSubject(r.subject);
          setPriceKsh(r.priceKsh); setKeptFiles(r.files);
          setOldThumbnailPath(r.thumbnailPath);
        }
      }
      const draft = await loadDraft(draftKey);
      if (!cancelled && draft) {
        setTitle(draft.fields.title); setDescription(draft.fields.description);
        setLevel(draft.fields.level); setGrade(draft.fields.grade); setSubject(draft.fields.subject);
        setPriceKsh(draft.fields.priceKsh);
        setNewFiles(draft.newFiles ?? []);
        setThumbnail(draft.thumbnail ?? null);
        setRemovedPaths(draft.removedPaths ?? []);
        setDraftRestored(true);
      }
      if (!cancelled) hydrated.current = true;
    })();
    return () => { cancelled = true; };
  }, [editing, id, draftKey]);

  // Autosave the draft (debounced) once hydrated, so a refresh keeps everything.
  useEffect(() => {
    if (!hydrated.current) return;
    const t = setTimeout(() => {
      saveDraft(draftKey, {
        fields: { title, description, level, grade, subject, priceKsh },
        newFiles, thumbnail, removedPaths, savedAt: Date.now(),
      });
    }, 500);
    return () => clearTimeout(t);
  }, [draftKey, title, description, level, grade, subject, priceKsh, newFiles, thumbnail, removedPaths]);

  async function discardDraft() {
    await clearDraft(draftKey);
    setDraftRestored(false);
    setNewFiles([]); setThumbnail(null); setRemovedPaths([]);
    if (editing && id) {
      const r = await getResource(id);
      if (r) {
        setTitle(r.title); setDescription(r.description);
        setLevel(r.level); setGrade(r.grade); setSubject(r.subject);
        setPriceKsh(r.priceKsh); setKeptFiles(r.files);
        setOldThumbnailPath(r.thumbnailPath);
      }
    } else {
      setTitle(''); setDescription(''); setLevel('lower_primary');
      setGrade(''); setSubject(''); setPriceKsh(0);
    }
  }

  // Object-URL preview for a freshly picked thumbnail (guarded for jsdom).
  const thumbPreview = useMemo(() => {
    if (thumbnail && typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
      return URL.createObjectURL(thumbnail);
    }
    return null;
  }, [thumbnail]);
  useEffect(() => {
    if (!thumbPreview) return;
    return () => URL.revokeObjectURL(thumbPreview);
  }, [thumbPreview]);

  function addFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    setNewFiles(prev => [...prev, ...Array.from(list)]);
  }
  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer?.files ?? null);
  }
  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    if (!dragOver) setDragOver(true);
  }
  function onDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
  }
  function onThumbDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragThumb(false);
    const img = Array.from(e.dataTransfer?.files ?? []).find(f => f.type.startsWith('image/'));
    if (img) setThumbnail(img);
  }
  function onThumbDragOver(e: React.DragEvent) {
    e.preventDefault();
    if (!dragThumb) setDragThumb(true);
  }
  function onThumbDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDragThumb(false);
  }
  function removeNew(idx: number) {
    setNewFiles(f => f.filter((_, i) => i !== idx));
  }
  function removeKept(path: string) {
    setKeptFiles(f => f.filter(x => x.path !== path));
    setRemovedPaths(p => [...p, path]);
  }

  function readDuration(file: File): Promise<number | null> {
    if (typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') {
      return Promise.resolve(null);
    }
    return new Promise(resolve => {
      const el = document.createElement(file.type.startsWith('audio') ? 'audio' : 'video');
      el.preload = 'metadata';
      el.onloadedmetadata = () => { URL.revokeObjectURL(el.src); resolve(Math.round(el.duration) || null); };
      el.onerror = () => resolve(null);
      el.src = URL.createObjectURL(file);
    });
  }

  async function onMediaSelected(file: File) {
    const cap = kind === 'audio' ? 100 : 500;
    if (file.size > cap * 1024 * 1024) { setError(`File exceeds the ${cap} MB limit.`); return; }
    setError('');
    setMedia(file);
    setDurationSec(await readDuration(file));
  }

  // Switch resource kind and clear kind-specific selections.
  function changeKind(k: ResourceKind) {
    setKind(k);
    setMedia(null);
    setDurationSec(null);
    setQuiz([]);
  }

  // Quiz builder helpers — all edits flow through setQuiz.
  function addQuestion() {
    setQuiz(q => [...q, { prompt: '', options: ['', ''], correctIndex: 0, explanation: '' }]);
  }
  function removeQuestion(i: number) {
    setQuiz(q => q.filter((_, idx) => idx !== i));
  }
  function updateQuestion(i: number, patch: Partial<QuizDraft>) {
    setQuiz(q => q.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  }
  function addOption(i: number) {
    setQuiz(q => q.map((item, idx) =>
      idx === i && item.options.length < 4 ? { ...item, options: [...item.options, ''] } : item));
  }
  function removeOption(i: number, optIdx: number) {
    setQuiz(q => q.map((item, idx) => {
      if (idx !== i || item.options.length <= 2) return item;
      const options = item.options.filter((_, o) => o !== optIdx);
      const correctIndex = item.correctIndex >= options.length ? options.length - 1 : item.correctIndex;
      return { ...item, options, correctIndex };
    }));
  }
  function setOption(i: number, optIdx: number, value: string) {
    setQuiz(q => q.map((item, idx) =>
      idx === i ? { ...item, options: item.options.map((o, o2) => (o2 === optIdx ? value : o)) } : item));
  }

  const fileCount = keptFiles.length + newFiles.length;

  // Preview the "<Subject> <Grade>" names the new files will be saved as.
  const canPreview = Boolean(subject && grade);
  const previewNames = useMemo(
    () => previewUploadNames(newFiles, subject, grade, keptFiles.map(f => f.name)),
    [newFiles, subject, grade, keptFiles],
  );

  async function submit(status: ResourceStatus) {
    setError('');
    if (kind === 'document' && fileCount === 0) { setError('Add at least one file.'); return; }
    if (!title.trim()) { setError('Enter a title.'); return; }
    if (!grade) { setError('Choose a grade.'); return; }
    if (!subject) { setError('Choose a subject.'); return; }
    if (!sellerId) { setError('You must be signed in.'); return; }

    if (kind !== 'document' && !editing && !media) { setError('Add the video/audio file.'); return; }
    if (kind === 'audio' && !thumbnail && !oldThumbnailPath) { setError('Audio resources need a thumbnail.'); return; }
    if (kind === 'video' && quiz.some(q => !q.prompt.trim() || q.options.filter(o => o.trim()).length < 2)) {
      setError('Each quiz question needs a prompt and at least 2 options.'); return;
    }
    const quizPublic: QuizQuestionPublic[] = quiz.map(q => ({ prompt: q.prompt.trim(), options: q.options.filter(o => o.trim()) }));
    const quizAnswers: QuizAnswer[] = quiz.map(q => ({ correctIndex: q.correctIndex, explanation: q.explanation.trim() || undefined }));

    const meta = { title: title.trim(), description: description.trim(), level, grade, subject, priceKsh, status, kind };
    setProgress(0);
    try {
      if (editing && id) {
        await updateResource(sellerId, id, {
          meta, keptFiles, newFiles, removedFilePaths: removedPaths,
          newThumbnail: thumbnail, oldThumbnailPath,
        });
      } else {
        await createResource(sellerId, sellerName, meta, newFiles, thumbnail, setProgress,
          { media, durationSec, quiz: quizPublic, quizAnswers });
      }
      await clearDraft(draftKey);
      setProgress(null);
      navigate('/seller/resources');
    } catch {
      setError('Upload failed. Please try again.');
      setProgress(null);
    }
  }

  const busy = progress !== null;

  const labelCls = 'block text-[13px] font-semibold text-[#374151] mb-1.5';
  const inputCls =
    'w-full bg-white border border-[#e2e8e2] rounded-xl px-3.5 py-2.5 text-sm text-[#1f2937] ' +
    'outline-none transition placeholder:text-[#9aa39a] focus:border-[#16a34a] focus:ring-2 focus:ring-[#16a34a]/20';
  const selectCls = `${inputCls} appearance-none pr-9 cursor-pointer`;

  return (
    <div className="max-w-3xl mx-auto pb-24">
      {/* Header */}
      <div className="mb-5">
        <Link to="/seller/resources"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#16a34a] hover:underline">
          <ArrowLeft size={16} /> Back to resources
        </Link>
        <h1 className="mt-2 text-2xl font-extrabold text-[#1f2937]">
          {editing ? 'Edit resource' : 'Create a resource'}
        </h1>
        <p className="text-sm text-[#7a847a] mt-0.5">
          Add your materials, set where they fit and price them for learners.
        </p>
      </div>

      {error && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
          <AlertCircle size={17} className="mt-0.5 shrink-0" /> <span>{error}</span>
        </div>
      )}

      {draftRestored && (
        <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-[#bfe6cd] bg-[#f0fdf4] px-4 py-3 text-sm text-[#15803d]">
          <RotateCcw size={16} className="shrink-0" />
          <span className="flex-1">We restored your unsaved draft — pick up where you left off.</span>
          <button type="button" onClick={discardDraft} className="font-bold hover:underline">Discard</button>
        </div>
      )}

      <div className="space-y-5">
        {/* Resource kind */}
        <section className="bg-white border border-[#e8ece8] rounded-2xl p-5 md:p-6">
          <h2 className="text-sm font-bold text-[#1f2937]">Type</h2>
          <p className="text-xs text-[#7a847a] mt-0.5 mb-4">Choose what kind of resource this is.</p>

          <div className="grid grid-cols-3 gap-3">
            {KIND_OPTIONS.map(({ key, label, icon: Icon }) => {
              const active = kind === key;
              return (
                <button key={key} type="button" onClick={() => changeKind(key)}
                  aria-pressed={active}
                  className={`flex flex-col items-center justify-center gap-2 rounded-2xl border px-3 py-4 text-sm font-semibold transition ${
                    active
                      ? 'border-[#16a34a] bg-[#eaf7ee] text-[#15803d] ring-2 ring-[#16a34a]/20'
                      : 'border-[#e2e8e2] bg-white text-[#374151] hover:border-[#16a34a] hover:bg-[#f3faf5]'}`}>
                  <Icon size={20} className={active ? 'text-[#16a34a]' : 'text-[#9aa39a]'} />
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Details */}
        <section className="bg-white border border-[#e8ece8] rounded-2xl p-5 md:p-6">
          <h2 className="text-sm font-bold text-[#1f2937]">Details</h2>
          <p className="text-xs text-[#7a847a] mt-0.5 mb-4">A clear title and summary help learners choose.</p>

          <div className="space-y-4">
            <div>
              <label htmlFor="title" className={labelCls}>Title</label>
              <input id="title" className={inputCls} value={title}
                placeholder="e.g. KCSE Biology 2026 Revision"
                onChange={e => setTitle(e.target.value)} />
            </div>
            <div>
              <label htmlFor="description" className={labelCls}>Description</label>
              <textarea id="description" rows={4} className={`${inputCls} resize-y`} value={description}
                placeholder="What's inside, who it's for, what learners will gain…"
                onChange={e => setDescription(e.target.value)} />
            </div>
          </div>
        </section>

        {/* Classification */}
        <section className="bg-white border border-[#e8ece8] rounded-2xl p-5 md:p-6">
          <h2 className="text-sm font-bold text-[#1f2937]">Classification</h2>
          <p className="text-xs text-[#7a847a] mt-0.5 mb-4">Pick where this fits so it shows up in the right place.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="level" className={labelCls}>Level</label>
              <div className="relative">
                <select id="level" className={selectCls} value={level}
                  onChange={e => changeLevel(e.target.value as ResourceLevel)}>
                  {RESOURCE_LEVELS.map(l => <option key={l.key} value={l.key}>{l.label}</option>)}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9aa39a]" />
              </div>
            </div>
            <div>
              <label htmlFor="grade" className={labelCls}>Grade</label>
              <div className="relative">
                <select id="grade" className={selectCls} value={grade}
                  onChange={e => setGrade(e.target.value)}>
                  <option value="">Select…</option>
                  {activeLevel.grades.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9aa39a]" />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className={labelCls}>Subject</label>
              <div className="relative">
                <select id="subject" className={selectCls} value={subject}
                  onChange={e => setSubject(e.target.value)}>
                  <option value="">Select…</option>
                  {activeLevel.subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9aa39a]" />
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="bg-white border border-[#e8ece8] rounded-2xl p-5 md:p-6">
          <h2 className="text-sm font-bold text-[#1f2937]">Pricing</h2>
          <p className="text-xs text-[#7a847a] mt-0.5 mb-4">Set a price, or leave it at 0 to offer it free.</p>

          <div>
            <label htmlFor="price" className={labelCls}>Price</label>
            <div className="relative max-w-[220px]">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#7a847a]">KSh</span>
              <input id="price" type="number" min={0} className={`${inputCls} pl-12`} value={priceKsh}
                onChange={e => setPriceKsh(Math.max(0, Number(e.target.value) || 0))} />
            </div>
            <p className="text-xs text-[#9aa39a] mt-1.5">{priceKsh === 0 ? 'This resource will be free.' : `Learners pay KSh ${priceKsh.toLocaleString()}.`}</p>
          </div>
        </section>

        {/* Primary media (video / audio) */}
        {kind !== 'document' && (
          <section className="bg-white border border-[#e8ece8] rounded-2xl p-5 md:p-6">
            <h2 className="text-sm font-bold text-[#1f2937]">{kind === 'audio' ? 'Audio' : 'Video'} file</h2>
            <p className="text-xs text-[#7a847a] mt-0.5 mb-4">
              Upload the primary {kind} file — {kind === 'audio' ? 'audio' : 'video'}/* up to {kind === 'audio' ? 100 : 500}&nbsp;MB.
            </p>

            {media && (
              <div className="mb-4 flex items-center gap-3 rounded-xl border border-[#dcfce7] bg-[#f3faf5] px-3 py-2.5">
                <span className="w-9 h-9 rounded-lg bg-[#eaf7ee] grid place-items-center text-[#16a34a] shrink-0">
                  {kind === 'audio' ? <Music size={17} /> : <Video size={17} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-[#1f2937] truncate">{media.name}</span>
                  <span className="block text-[11px] text-[#9aa39a]">
                    {formatBytes(media.size)}{durationSec ? ` · ${formatDuration(durationSec)}` : ''}
                  </span>
                </span>
                <button type="button" onClick={() => { setMedia(null); setDurationSec(null); }} aria-label={`Remove ${media.name}`}
                  className="w-7 h-7 grid place-items-center rounded-full text-[#9aa39a] hover:bg-[#fef2f2] hover:text-[#ef4444] transition">
                  <X size={15} />
                </button>
              </div>
            )}

            <label htmlFor="media"
              className="group flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#d7ddd7] bg-[#fafcfa] px-4 py-8 text-center cursor-pointer transition hover:border-[#16a34a] hover:bg-[#f3faf5]">
              <span className="w-12 h-12 rounded-full bg-[#eaf7ee] grid place-items-center text-[#16a34a] transition group-hover:scale-105">
                {kind === 'audio' ? <Music size={22} /> : <Video size={22} />}
              </span>
              <span className="text-sm font-semibold text-[#374151]">
                {media ? `Replace ${kind} file` : `Add ${kind} file`}
              </span>
              <span className="text-xs text-[#7a847a]">click to browse</span>
              <input id="media" type="file" accept={kind === 'audio' ? 'audio/*' : 'video/*'} className="sr-only"
                onChange={e => { const f = e.target.files?.[0]; if (f) onMediaSelected(f); e.target.value = ''; }} />
            </label>
          </section>
        )}

        {/* Quiz builder (video only) */}
        {kind === 'video' && (
          <section className="bg-white border border-[#e8ece8] rounded-2xl p-5 md:p-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold text-[#1f2937]">Quiz <span className="font-normal text-[#9aa39a]">(optional)</span></h2>
              <button type="button" onClick={addQuestion}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#d7ddd7] bg-white px-3 py-1.5 text-xs font-bold text-[#374151] hover:border-[#16a34a] hover:bg-[#f3faf5] transition">
                <Plus size={14} /> Add question
              </button>
            </div>
            <p className="text-xs text-[#7a847a] mt-0.5 mb-4">Add multiple-choice questions learners answer after watching.</p>

            {quiz.length === 0 ? (
              <p className="text-sm text-[#9aa39a]">No questions yet — add one to build a quiz.</p>
            ) : (
              <ul className="space-y-4">
                {quiz.map((q, i) => (
                  <li key={i} className="rounded-xl border border-[#eef1ee] bg-[#fafcfa] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-[#7a847a]">Question {i + 1}</span>
                      <button type="button" onClick={() => removeQuestion(i)} aria-label={`Remove question ${i + 1}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#ef4444] hover:underline">
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>

                    <input className={inputCls} value={q.prompt} placeholder="Question prompt"
                      aria-label={`Question ${i + 1} prompt`}
                      onChange={e => updateQuestion(i, { prompt: e.target.value })} />

                    <div className="mt-3 space-y-2">
                      {q.options.map((opt, o) => (
                        <div key={o} className="flex items-center gap-2.5">
                          <input type="radio" name={`correct-${i}`} checked={q.correctIndex === o}
                            aria-label={`Mark option ${o + 1} correct for question ${i + 1}`}
                            onChange={() => updateQuestion(i, { correctIndex: o })}
                            className="accent-[#16a34a]" />
                          <input className={`${inputCls} flex-1`} value={opt} placeholder={`Option ${o + 1}`}
                            aria-label={`Question ${i + 1} option ${o + 1}`}
                            onChange={e => setOption(i, o, e.target.value)} />
                          {q.options.length > 2 && (
                            <button type="button" onClick={() => removeOption(i, o)} aria-label={`Remove option ${o + 1}`}
                              className="w-7 h-7 grid place-items-center rounded-full text-[#9aa39a] hover:bg-[#fef2f2] hover:text-[#ef4444] transition shrink-0">
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {q.options.length < 4 && (
                      <button type="button" onClick={() => addOption(i)}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#16a34a] hover:underline">
                        <Plus size={13} /> Add option
                      </button>
                    )}

                    <input className={`${inputCls} mt-3`} value={q.explanation} placeholder="Explanation (optional)"
                      aria-label={`Question ${i + 1} explanation`}
                      onChange={e => updateQuestion(i, { explanation: e.target.value })} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Files */}
        <section className="bg-white border border-[#e8ece8] rounded-2xl p-5 md:p-6">
          <h2 className="text-sm font-bold text-[#1f2937]">{kind === 'document' ? 'Files' : 'Supporting files'} {kind !== 'document' && <span className="font-normal text-[#9aa39a]">(optional)</span>}</h2>
          <p className="text-xs text-[#7a847a] mt-0.5 mb-4">
            Upload the materials buyers receive — they’re saved named after your subject and grade.
          </p>

          {/* Existing + newly-picked files */}
          {fileCount > 0 && (
            <ul className="mb-4 space-y-2">
              {keptFiles.map(f => (
                <li key={f.path} className="flex items-center gap-3 rounded-xl border border-[#eef1ee] bg-[#fafcfa] px-3 py-2.5">
                  <span className="w-9 h-9 rounded-lg bg-[#eaf7ee] grid place-items-center text-[#16a34a] shrink-0"><FileText size={17} /></span>
                  <span className="min-w-0 flex-1 text-sm font-medium text-[#1f2937] truncate">{f.name}</span>
                  <span className="text-xs text-[#9aa39a]">{formatBytes(f.size)}</span>
                  <button type="button" onClick={() => removeKept(f.path)} aria-label={`Remove ${f.name}`}
                    className="w-7 h-7 grid place-items-center rounded-full text-[#9aa39a] hover:bg-[#fef2f2] hover:text-[#ef4444] transition">
                    <X size={15} />
                  </button>
                </li>
              ))}
              {newFiles.map((f, i) => (
                <li key={`${f.name}-${i}`} className="flex items-center gap-3 rounded-xl border border-[#dcfce7] bg-[#f3faf5] px-3 py-2.5">
                  <span className="w-9 h-9 rounded-lg bg-[#eaf7ee] grid place-items-center text-[#16a34a] shrink-0"><FileText size={17} /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-[#1f2937] truncate">
                      {canPreview ? previewNames[i] : f.name}
                    </span>
                    {canPreview && (
                      <span className="block text-[11px] text-[#9aa39a] truncate">from {f.name}</span>
                    )}
                  </span>
                  <span className="text-xs text-[#16a34a] font-semibold shrink-0">new · {formatBytes(f.size)}</span>
                  <button type="button" onClick={() => removeNew(i)} aria-label={`Remove ${f.name}`}
                    className="w-7 h-7 grid place-items-center rounded-full text-[#9aa39a] hover:bg-[#fef2f2] hover:text-[#ef4444] transition">
                    <X size={15} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Dropzone — click to browse or drag & drop */}
          <label htmlFor="files"
            onDrop={onDrop} onDragOver={onDragOver} onDragEnter={onDragOver} onDragLeave={onDragLeave}
            className={`group flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 text-center cursor-pointer transition ${
              dragOver
                ? 'border-[#16a34a] bg-[#eaf7ee] ring-2 ring-[#16a34a]/20'
                : 'border-[#d7ddd7] bg-[#fafcfa] hover:border-[#16a34a] hover:bg-[#f3faf5]'}`}>
            <span className={`w-12 h-12 rounded-full bg-[#eaf7ee] grid place-items-center text-[#16a34a] transition ${dragOver ? 'scale-110' : 'group-hover:scale-105'}`}>
              <UploadCloud size={22} />
            </span>
            <span className="text-sm font-semibold text-[#374151]">
              {dragOver ? 'Drop files here' : editing ? 'Add more files' : 'Drag & drop files here'}
            </span>
            <span className="text-xs text-[#7a847a]">or click to browse — PDFs, docs, slides. Up to 50&nbsp;MB each.</span>
            <input id="files" type="file" multiple className="sr-only"
              onChange={e => { addFiles(e.target.files); e.target.value = ''; }} />
          </label>

          {/* Thumbnail */}
          <div className="mt-5">
            <label htmlFor="thumb" className={labelCls}>Cover image <span className="font-normal text-[#9aa39a]">(optional)</span></label>
            <label htmlFor="thumb"
              onDrop={onThumbDrop} onDragOver={onThumbDragOver} onDragEnter={onThumbDragOver} onDragLeave={onThumbDragLeave}
              className={`flex items-center gap-4 rounded-2xl border p-3 cursor-pointer transition ${
                dragThumb ? 'border-[#16a34a] bg-[#eaf7ee] ring-2 ring-[#16a34a]/20' : 'border-[#e2e8e2] hover:border-[#16a34a]'}`}>
              <span className="w-16 h-16 rounded-xl bg-[#f2f5f2] grid place-items-center overflow-hidden shrink-0 text-[#9aa39a]">
                {thumbPreview
                  ? <img src={thumbPreview} alt="" className="w-full h-full object-cover" />
                  : <ImagePlus size={20} />}
              </span>
              <span className="text-sm text-[#7a847a]">
                {dragThumb
                  ? 'Drop image here'
                  : thumbnail
                    ? thumbnail.name
                    : 'Drag & drop or click — add a cover to help your resource stand out.'}
              </span>
              <input id="thumb" type="file" accept="image/*" className="sr-only"
                onChange={e => setThumbnail(e.target.files?.[0] ?? null)} />
            </label>
          </div>
        </section>

        {/* Upload progress */}
        {busy && (
          <div className="bg-white border border-[#e8ece8] rounded-2xl p-5">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-semibold text-[#374151]">Uploading…</span>
              <span className="text-[#16a34a] font-bold tabular-nums">{Math.round((progress ?? 0) * 100)}%</span>
            </div>
            <div className="h-2 bg-[#eef1ee] rounded-full overflow-hidden">
              <div className="h-full bg-[#16a34a] transition-all" style={{ width: `${Math.round((progress ?? 0) * 100)}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Sticky action bar */}
      <div className="sticky bottom-4 z-10 mt-6 flex items-center gap-3 rounded-2xl border border-[#e8ece8] bg-white/90 backdrop-blur px-4 py-3 shadow-[0_6px_24px_rgba(15,23,42,0.08)]">
        <span className="mr-auto hidden sm:block text-xs text-[#9aa39a]">
          {fileCount > 0 ? `${fileCount} file${fileCount === 1 ? '' : 's'} attached` : 'Attach at least one file to publish.'}
        </span>
        <button type="button" onClick={() => submit('draft')} disabled={busy}
          className="bg-white border border-[#d7ddd7] hover:bg-[#f3f7f3] text-[#374151] text-sm font-bold rounded-xl px-6 py-2.5 transition disabled:opacity-50 disabled:cursor-not-allowed">
          Save draft
        </button>
        <button type="button" onClick={() => submit('published')} disabled={busy}
          className="bg-[#16a34a] hover:bg-[#15913f] text-white text-sm font-bold rounded-xl px-6 py-2.5 shadow-sm shadow-green-600/20 transition disabled:opacity-50 disabled:cursor-not-allowed">
          Publish
        </button>
      </div>
    </div>
  );
}
