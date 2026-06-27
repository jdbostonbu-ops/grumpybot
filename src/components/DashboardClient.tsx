'use client';

import { EMBED_THEMES, DEFAULT_THEME, type EmbedTheme } from '@/lib/embed-themes';
import { useState, useRef, type FormEvent, type ChangeEvent } from 'react';

type DocItem = {
  id: string;
  filename: string;
};

type ChatMessage = {
  role: 'user' | 'bot';
  text: string;
  sources?: string[];
};

type InitialTheme = {
  background: string | null;
  text: string | null;
  accent: string | null;
};

type DashboardClientProps = {
  botName: string;
  botId: string;
  initialSlug: string;
  embedUrl: string;
  initialDocs: DocItem[];
  initialChunkCount: number;
  initialTheme: InitialTheme;
};

export const DashboardClient = (props: DashboardClientProps): React.ReactElement => {
  const [docs, setDocs] = useState<DocItem[]>(props.initialDocs);
  const [chunkCount, setChunkCount] = useState(props.initialChunkCount);
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [slug, setSlug] = useState(props.initialSlug);
  const [slugDraft, setSlugDraft] = useState(props.initialSlug);
  const [slugError, setSlugError] = useState('');
  const [slugStatus, setSlugStatus] = useState<'' | 'saving' | 'saved'>('');
  const [copyStatus, setCopyStatus] = useState<'' | 'link' | 'embed'>('');

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAsking, setIsAsking] = useState(false);
  const [themeBackground, setThemeBackground] = useState(
    props.initialTheme.background ?? DEFAULT_THEME.background,
  );
  const [themeText, setThemeText] = useState(
    props.initialTheme.text ?? DEFAULT_THEME.text,
  );
  const [themeAccent, setThemeAccent] = useState(
    props.initialTheme.accent ?? DEFAULT_THEME.accent,
  );
  const [themeStatus, setThemeStatus] = useState<'' | 'saving' | 'saved'>('');
  const [themeError, setThemeError] = useState('');
  const [showCustomTheme, setShowCustomTheme] = useState(false);
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryRagType, setInquiryRagType] = useState('');
  const [inquiryAudience, setInquiryAudience] = useState('');
  const [inquiryProject, setInquiryProject] = useState('');
  const [inquiryGoals, setInquiryGoals] = useState('');
  const [inquiryDeadline, setInquiryDeadline] = useState('');
  const [inquiryStatus, setInquiryStatus] = useState<'' | 'sending' | 'sent' | 'error'>('');
  const [inquiryError, setInquiryError] = useState('');

  const uploadFile = async (file: File): Promise<void> => {
    setUploadError('');
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/bot/upload', {
        method: 'POST',
        body: formData,
      });
      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; id?: string; filename?: string; chunks?: number; error?: string }
        | null;

      if (!response.ok || data?.ok !== true) {
        setUploadError(data?.error ?? 'Upload failed.');
      } else {
        setDocs((current) => [
          ...current,
          { id: data.id ?? `${Date.now()}`, filename: data.filename ?? file.name },
        ]);
        setChunkCount((current) => current + (data.chunks ?? 0));
      }
    } catch {
      setUploadError('Upload failed. Please try again.');
    }
    setIsUploading(false);
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file !== undefined) {
      void uploadFile(file);
    }
    event.target.value = '';
  };

  const openFilePicker = (): void => {
    fileInputRef.current?.click();
  };

  const requestDelete = (id: string): void => {
    setDeleteError('');
    setPendingDeleteId(id);
  };

  const cancelDelete = (): void => {
    setPendingDeleteId(null);
    setDeleteError('');
  };

  const applyPreset = (preset: EmbedTheme): void => {
    setThemeBackground(preset.background);
    setThemeText(preset.text);
    setThemeAccent(preset.accent);
    setThemeStatus('');
    setThemeError('');
    setShowCustomTheme(false);
  };

  const saveTheme = async (): Promise<void> => {
    setThemeError('');
    setThemeStatus('saving');
    try {
      const response = await fetch('/api/bot/theme', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          themeBackground,
          themeText,
          themeAccent,
        }),
      });
      const data = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      if (!response.ok) {
        setThemeError(data?.error ?? 'Could not save colors.');
        setThemeStatus('');
        return;
      }
      setThemeStatus('saved');
    } catch {
      setThemeError('Could not save colors. Please try again.');
      setThemeStatus('');
    }
  };

  const submitInquiry = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (inquiryStatus === 'sending') {
      return;
    }
    setInquiryStatus('sending');
    setInquiryError('');
    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: inquiryName,
          email: inquiryEmail,
          phone: inquiryPhone,
          ragType: inquiryRagType,
          audience: inquiryAudience,
          project: inquiryProject,
          goals: inquiryGoals,
          deadline: inquiryDeadline,
        }),
      });
      const data = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      if (!response.ok) {
        setInquiryError(data?.error ?? 'Could not send. Try again.');
        setInquiryStatus('error');
        return;
      }
      setInquiryStatus('sent');
    } catch {
      setInquiryError('Could not send. Try again.');
      setInquiryStatus('error');
    }
  };

  const saveSlug = async (): Promise<void> => {
    const trimmed = slugDraft.trim().toLowerCase();
    if (trimmed === '') {
      setSlugError('Enter a slug.');
      return;
    }
    setSlugError('');
    setSlugStatus('saving');
    try {
      const response = await fetch('/api/bot/slug', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: trimmed }),
      });
      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; slug?: string; error?: string }
        | null;

      if (!response.ok || data?.ok !== true) {
        setSlugError(data?.error ?? 'Could not save slug.');
        setSlugStatus('');
        return;
      }

      const newSlug = data.slug ?? trimmed;
      setSlug(newSlug);
      setSlugDraft(newSlug);
      setSlugStatus('saved');
      setTimeout(() => { setSlugStatus(''); }, 1800);
    } catch {
      setSlugError('Could not save slug. Please try again.');
      setSlugStatus('');
    }
  };

  const confirmDelete = async (id: string): Promise<void> => {
    setIsDeleting(true);
    setDeleteError('');
    try {
      const response = await fetch(`/api/bot/document/${id}`, {
        method: 'DELETE',
      });
      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; chunks?: number; error?: string }
        | null;

      if (!response.ok || data?.ok !== true) {
        setDeleteError(data?.error ?? 'Delete failed.');
      } else {
        setDocs((current) => current.filter((d) => d.id !== id));
        setChunkCount((current) => Math.max(0, current - (data.chunks ?? 0)));
        setPendingDeleteId(null);
      }
    } catch {
      setDeleteError('Delete failed. Please try again.');
    }
    setIsDeleting(false);
  };

  const ask = async (question: string): Promise<void> => {
    const trimmed = question.trim();
    if (trimmed === '' || isAsking) {
      return;
    }
    setMessages((current) => [...current, { role: 'user', text: trimmed }]);
    setIsAsking(true);
    try {
      const response = await fetch('/api/bot/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed }),
      });
      const data = (await response.json().catch(() => null)) as
        | { answer?: string; sources?: string[]; error?: string }
        | null;

      if (!response.ok || data?.answer === undefined) {
        setMessages((current) => [
          ...current,
          { role: 'bot', text: data?.error ?? 'Something went wrong.' },
        ]);
      } else {
        setMessages((current) => [
          ...current,
          { role: 'bot', text: data.answer ?? '', sources: data.sources },
        ]);
      }
    } catch {
      setMessages((current) => [
        ...current,
        { role: 'bot', text: 'Something went wrong. Please try again.' },
      ]);
    }
    setIsAsking(false);
  };

  const onAskSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const question = String(formData.get('preview-question') ?? '');
    void ask(question);
    event.currentTarget.reset();
  };

  return (
    <div className="dash">

      <section className="dash-header-band">
        <div className="dash-header-band__inner">
          <p className="dash-eyebrow">Dashboard</p>
          <h1 className="dash-h1">
            Your bot is live{' '}
            <span className="confetti-trigger">
              <span className="confetti-emoji">🎉</span>
              <span className="confetti-piece" aria-hidden="true"></span>
              <span className="confetti-piece" aria-hidden="true"></span>
              <span className="confetti-piece" aria-hidden="true"></span>
              <span className="confetti-piece" aria-hidden="true"></span>
              <span className="confetti-piece" aria-hidden="true"></span>
              <span className="confetti-piece" aria-hidden="true"></span>
              <span className="confetti-piece" aria-hidden="true"></span>
              <span className="confetti-piece" aria-hidden="true"></span>
            </span>
          </h1>
          <p className="dash-meta">
            Answering from {docs.length} document{docs.length === 1 ? '' : 's'} ·{' '}
            {chunkCount} chunk{chunkCount === 1 ? '' : 's'} indexed
          </p>
        </div>
      </section>

      <div className="dash-body">

        <div className="stat-grid">
          <div className="stat stat--purple">
            <span className="stat__label">Documents</span>
            <span className="stat__value">{docs.length}</span>
          </div>
          <div className="stat stat--green">
            <span className="stat__label">Chunks indexed</span>
            <span className="stat__value">{chunkCount}</span>
          </div>
          <div className="stat stat--pink">
            <span className="stat__label">Status</span>
            <span className="stat__value">• Live</span>
          </div>
        </div>

        <div className="kb-head">
          <h2>📚 Knowledge base</h2>
          <button type="button" className="btn btn--yellow" onClick={openFilePicker}>
            + Add document
          </button>
        </div>

        <input
          ref={fileInputRef}
          id="dash-file"
          type="file"
          accept=".md,.txt,.json"
          onChange={onFileChange}
          aria-label="Upload a document"
          className="sr-only"
        />

        <button
          type="button"
          className="dropzone"
          onClick={openFilePicker}
          disabled={isUploading}
        >
          {isUploading
            ? 'Uploading…'
            : 'Drag files here — .md, .txt, .json'}
        </button>

        {uploadError !== '' ? <p className="error">{uploadError}</p> : null}
        {deleteError !== '' ? <p className="error">{deleteError}</p> : null}

        <div className="doc-list">
          {docs.length === 0 ? (
            <p className="doc-empty">No documents yet. Add one to get started.</p>
          ) : (
            docs.map((doc) => (
              <div key={doc.id} className="doc-row">
                <span className="doc-row__name">📄 {doc.filename}</span>
                {pendingDeleteId === doc.id ? (
                  <span className="doc-row__confirm">
                    <span className="doc-row__confirm-text">Delete this document?</span>
                    <button
                      type="button"
                      className="doc-row__confirm-cancel"
                      onClick={cancelDelete}
                      disabled={isDeleting}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="doc-row__confirm-yes"
                      onClick={() => void confirmDelete(doc.id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Deleting…' : 'Delete'}
                    </button>
                  </span>
                ) : (
                  <span className="doc-row__actions">
                    <span className="doc-row__status">• indexed</span>
                    <button
                      type="button"
                      className="doc-row__delete"
                      onClick={() => requestDelete(doc.id)}
                      aria-label={`Delete ${doc.filename}`}
                    >
                      🗑
                    </button>
                  </span>
                )}
              </div>
            ))
          )}
        </div>

      </div>

      <section className="dash-quote-band">
        <p className="dash-quote">
          <span className="dash-quote__mark">&ldquo;</span>
          Upload markdown files. Talk to the chatbot. <br />Copy the embed.{' '}
          <span className="dash-quote__pop">Add it to your code.</span>
          <span className="dash-quote__mark">&rdquo;</span>
        </p>
      </section>

      <section className="dash-explainer">
        <div className="dash-explainer__inner">
          <h2 className="dash-explainer__title">How to share your bot</h2>
          <div className="dash-explainer__items">
            <div className="dash-explainer__item">
              <h3 className="dash-explainer__item-title">Bot slug</h3>
              <p className="dash-explainer__item-body">
                Pick a short custom name (like <code>muttstrut</code>). It becomes part of your bot&apos;s URL.
              </p>
            </div>
            <div className="dash-explainer__item">
              <h3 className="dash-explainer__item-title">Public link</h3>
              <p className="dash-explainer__item-body">
                The full URL to your bot&apos;s chat. Paste it anywhere a link can go: Instagram bio, email signature, QR code.
              </p>
            </div>
            <div className="dash-explainer__item">
              <h3 className="dash-explainer__item-title">Embed snippet</h3>
              <p className="dash-explainer__item-body">
                A line of code that puts your bot inside any website that lets you paste HTML.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="dash-body">
        <div className="dash-split">
          <div
            className="preview-mode"
            style={{
              '--preview-bg': themeBackground,
              '--preview-text': themeText,
              '--preview-accent': themeAccent,
              '--preview-bot-bubble':
                EMBED_THEMES.find(
                  (preset) =>
                    preset.background === themeBackground &&
                    preset.text === themeText &&
                    preset.accent === themeAccent,
                )?.botBubble ?? DEFAULT_THEME.botBubble,
            } as React.CSSProperties}
          >
          <div className="dash-panel dash-panel--teal">
            <h3 className="dash-panel__title">👁 Preview your bot</h3>
            <p className="dash-panel__sub">Test questions before customers do</p>

            <div className="dash-chat">
              {messages.length === 0 ? (
                <p className="dash-chat__hint">Ask your bot a question below.</p>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={
                      message.role === 'user'
                        ? 'bubble bubble--user'
                        : 'bubble bubble--bot'
                    }
                  >
                    <span className="bubble__text">{message.text}</span>
                    {message.sources && message.sources.length > 0 ? (
                      <span className="bubble__sources">
                        Sources: {message.sources.join(', ')}
                      </span>
                    ) : null}
                  </div>
                ))
              )}
              {isAsking ? <div className="bubble bubble--bot">Thinking…</div> : null}
            </div>

            <form className="chat-form" onSubmit={onAskSubmit}>
              <label htmlFor="preview-question" className="sr-only">
                Ask your bot
              </label>
              <input
                id="preview-question"
                name="preview-question"
                type="text"
                placeholder="Ask a question…"
                autoComplete="off"
                required
              />
              <button type="submit" className="btn btn--dark" disabled={isAsking}>
                Ask
              </button>
            </form>
          </div>
          </div>

          <div className="dash-panel dash-panel--green">
            <h3 className="dash-panel__title">🔗 Share / embed</h3>
            <p className="dash-panel__sub">
              Share the link anywhere, or paste the embed into your site code.
            </p>

            <p className="embed-field__label">Theme</p>
            <div className="theme-picker">
              {EMBED_THEMES.map((preset) => {
                const isSelected =
                  !showCustomTheme &&
                  preset.background === themeBackground &&
                  preset.text === themeText &&
                  preset.accent === themeAccent;
                return (
                  <button
                    type="button"
                    key={preset.key}
                    className={
                      isSelected
                        ? 'theme-card theme-card--selected'
                        : 'theme-card'
                    }
                    onClick={() => applyPreset(preset)}
                    style={{ background: preset.background, color: preset.text }}
                  >
                    <span
                      className="theme-card__dot"
                      style={{ background: preset.accent }}
                    />
                    <span className="theme-card__label">{preset.label}</span>
                  </button>
                );
              })}
              <button
                type="button"
                className={
                  showCustomTheme
                    ? 'theme-card theme-card--selected'
                    : 'theme-card'
                }
                onClick={() => {
                  setShowCustomTheme(true);
                  setThemeStatus('');
                  setThemeError('');
                }}
              >
                <span className="theme-card__label">Custom</span>
              </button>
            </div>

            {showCustomTheme ? (
              <div className="theme-custom">
                <div className="theme-custom__row">
                  <label
                    htmlFor="theme-bg"
                    className="theme-custom__label"
                  >
                    Background
                  </label>
                  <input
                    id="theme-bg"
                    type="color"
                    value={themeBackground}
                    onChange={(event) => {
                      setThemeBackground(event.target.value);
                      setThemeStatus('');
                    }}
                  />
                  <span className="theme-custom__hex">{themeBackground}</span>
                </div>
                <div className="theme-custom__row">
                  <label
                    htmlFor="theme-text"
                    className="theme-custom__label"
                  >
                    Text
                  </label>
                  <input
                    id="theme-text"
                    type="color"
                    value={themeText}
                    onChange={(event) => {
                      setThemeText(event.target.value);
                      setThemeStatus('');
                    }}
                  />
                  <span className="theme-custom__hex">{themeText}</span>
                </div>
                <div className="theme-custom__row">
                  <label
                    htmlFor="theme-accent"
                    className="theme-custom__label"
                  >
                    Accent
                  </label>
                  <input
                    id="theme-accent"
                    type="color"
                    value={themeAccent}
                    onChange={(event) => {
                      setThemeAccent(event.target.value);
                      setThemeStatus('');
                    }}
                  />
                  <span className="theme-custom__hex">{themeAccent}</span>
                </div>
              </div>
            ) : null}

            <button
              type="button"
              className="embed-field__copy theme-save"
              onClick={() => void saveTheme()}
              disabled={themeStatus === 'saving'}
            >
              {themeStatus === 'saving'
                ? 'Saving…'
                : themeStatus === 'saved'
                ? 'Saved ✓'
                : 'Save colors'}
            </button>
            {themeError !== '' ? <p className="slug-error">{themeError}</p> : null}

            <label htmlFor="bot-slug" className="embed-field__label">
              Bot slug
            </label>
            <div className="embed-field">
              <input
                id="bot-slug"
                type="text"
                value={slugDraft}
                onChange={(event) => {
                  setSlugDraft(event.target.value);
                  setSlugStatus('');
                }}
                placeholder="your-slug"
                autoComplete="off"
                className="embed-field__input"
              />
              <button
                type="button"
                className="embed-field__copy"
                onClick={() => void saveSlug()}
                disabled={slugStatus === 'saving' || slugDraft.trim() === slug}
              >
                {slugStatus === 'saving' ? 'Saving…' : slugStatus === 'saved' ? 'Saved ✓' : 'Save'}
              </button>
            </div>
            {slugError !== '' ? <p className="slug-error">{slugError}</p> : null}
            {slugStatus === 'saved' ? <p className="slug-saved">Saved.</p> : null}

            <label htmlFor="embed-url" className="embed-field__label">
              Public link
            </label>
            <div className="embed-field">
              <input
                id="embed-url"
                type="text"
                readOnly
                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/embed/${slug !== '' ? slug : props.botId}`}
                className="embed-field__input"
                onFocus={(event) => event.currentTarget.select()}
              />
              <button
                type="button"
                className="embed-field__copy"
                onClick={() => {
                  const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/embed/${slug !== '' ? slug : props.botId}`;
                  void navigator.clipboard.writeText(url);
                  setCopyStatus('link');
                  setTimeout(() => { setCopyStatus(''); }, 1800);
                }}
              >
                {copyStatus === 'link' ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <label htmlFor="embed-iframe" className="embed-field__label">
              Embed snippet
            </label>
            <div className="embed-field">
              <input
                id="embed-iframe"
                type="text"
                readOnly
                value={`<iframe src="${typeof window !== 'undefined' ? window.location.origin : ''}/embed/${slug !== '' ? slug : props.botId}" width="380" height="540" style="border:0"></iframe>`}
                className="embed-field__input"
                onFocus={(event) => event.currentTarget.select()}
              />
              <button
                type="button"
                className="embed-field__copy"
                onClick={() => {
                  const snippet = `<iframe src="${typeof window !== 'undefined' ? window.location.origin : ''}/embed/${slug !== '' ? slug : props.botId}" width="380" height="540" style="border:0"></iframe>`;
                  void navigator.clipboard.writeText(snippet);
                  setCopyStatus('embed');
                  setTimeout(() => { setCopyStatus(''); }, 1800);
                }}
              >
                {copyStatus === 'embed' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
        <section className="band band--hotpink">
          <div className="band__inner">
            <h2 className="band__title">Need a bot that isn't here?</h2>
            <p className="band__body">
              GrumpyBot handles Q&amp;A on your documents. For more advanced
              setups — Multimodal RAG (bots that read images), Agentic RAG
              (bots that reason in multiple steps), or Voice RAG (talk-to-your-bot)
              — we&apos;ll build it custom.
            </p>
            <p className="band__body">
              Tell us about your project. We&apos;ll send you ready-to-paste code for your site.
            </p>
            <button
              type="button"
              className="btn btn--dark band__cta"
              onClick={() => { setShowInquiry((v) => !v); }}
            >
              {showInquiry ? 'Hide form ↑' : 'Start project inquiry →'}
            </button>
          </div>
        </section>
        {showInquiry ? (
          <section className="inquiry-wrap is-open">
            <div className={inquiryStatus === 'sent' ? 'inquiry-card is-flipped' : 'inquiry-card'}>
              <div className="inquiry-card__back">
                {inquiryStatus === 'sent' ? (
                  <>
                    <h3 className="inquiry-card__back-title">Thank you!</h3>
                    <p className="inquiry-card__back-sub">
                      Your submission has been received. <br />We&apos;re getting Grumpy for you!
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="inquiry-card__back-title">GrumpyBot</h3>
                    <p className="inquiry-card__back-sub">we&apos;ll get back to you</p>
                  </>
                )}
              </div>
              <div className="inquiry-card__front">
                <form onSubmit={submitInquiry}>
                    <h3 className="inquiry-form__title">Tell us about your project</h3>

                    <div className="inquiry-form__grid">
                      <div>
                        <label htmlFor="inq-name" className="embed-field__label">Name</label>
                        <input
                          id="inq-name"
                          type="text"
                          required
                          value={inquiryName}
                          onChange={(event) => { setInquiryName(event.target.value); }}
                          className="embed-field__input"
                        />
                      </div>
                      <div>
                        <label htmlFor="inq-email" className="embed-field__label">Email</label>
                        <input
                          id="inq-email"
                          type="email"
                          required
                          value={inquiryEmail}
                          onChange={(event) => { setInquiryEmail(event.target.value); }}
                          className="embed-field__input"
                        />
                      </div>
                      <div>
                        <label htmlFor="inq-phone" className="embed-field__label">Phone</label>
                        <input
                          id="inq-phone"
                          type="tel"
                          value={inquiryPhone}
                          onChange={(event) => { setInquiryPhone(event.target.value); }}
                          className="embed-field__input"
                        />
                      </div>
                      <div>
                        <label htmlFor="inq-deadline" className="embed-field__label">Deadline</label>
                        <input
                          id="inq-deadline"
                          type="text"
                          value={inquiryDeadline}
                          onChange={(event) => { setInquiryDeadline(event.target.value); }}
                          placeholder="e.g. end of August"
                          className="embed-field__input"
                        />
                      </div>
                    </div>

                    <label htmlFor="inq-rag" className="embed-field__label">RAG type</label>
                    <select
                      id="inq-rag"
                      required
                      value={inquiryRagType}
                      onChange={(event) => { setInquiryRagType(event.target.value); }}
                      className="embed-field__input"
                    >
                      <option value="">Pick one…</option>
                      <option value="multimodal">Multimodal RAG (reads images)</option>
                      <option value="agentic">Agentic RAG (multi-step reasoning)</option>
                      <option value="voice">Voice RAG (talk to your bot)</option>
                      <option value="other">Other / not sure</option>
                    </select>

                    <label htmlFor="inq-audience" className="embed-field__label">Audience</label>
                    <input
                      id="inq-audience"
                      type="text"
                      required
                      value={inquiryAudience}
                      onChange={(event) => { setInquiryAudience(event.target.value); }}
                      placeholder="Who will use this bot?"
                      className="embed-field__input"
                    />

                    <label htmlFor="inq-project" className="embed-field__label">Tell us about your project</label>
                    <textarea
                      id="inq-project"
                      required
                      rows={4}
                      value={inquiryProject}
                      onChange={(event) => { setInquiryProject(event.target.value); }}
                      className="embed-field__input inquiry-form__textarea"
                    />

                    <label htmlFor="inq-goals" className="embed-field__label">What you want it to do</label>
                    <textarea
                      id="inq-goals"
                      required
                      rows={4}
                      value={inquiryGoals}
                      onChange={(event) => { setInquiryGoals(event.target.value); }}
                      className="embed-field__input inquiry-form__textarea"
                    />

                    <button
                      type="submit"
                      className="btn btn--dark inquiry-form__submit"
                      disabled={inquiryStatus === 'sending'}
                    >
                      {inquiryStatus === 'sending' ? 'Sending…' : 'Send inquiry'}
                    </button>
                    {inquiryError !== '' ? (
                      <p className="slug-error">{inquiryError}</p>
                    ) : null}
                  </form>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
};
