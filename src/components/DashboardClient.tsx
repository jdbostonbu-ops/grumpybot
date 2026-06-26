'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';

type DocItem = { id: string; filename: string };

type ChatMessage = {
  role: 'user' | 'bot';
  text: string;
  sources?: string[];
};

type DashboardClientProps = {
  botId: string;
  botName: string;
  initialDocuments: DocItem[];
  chunkCount: number;
};

export const DashboardClient = ({
  botName,
  initialDocuments,
  chunkCount,
}: DashboardClientProps): React.ReactElement => {
  const [documents, setDocuments] = useState<DocItem[]>(initialDocuments);
  const [indexedChunks, setIndexedChunks] = useState(chunkCount);
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAsking, setIsAsking] = useState(false);

  const handleFile = async (file: File): Promise<void> => {
    setUploadError('');
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/bot/upload', {
        method: 'POST',
        body: formData,
      });
      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; filename?: string; chunks?: number; error?: string }
        | null;

      if (!response.ok || !data?.ok) {
        setUploadError(data?.error ?? 'Upload failed. Please try again.');
        setIsUploading(false);
        return;
      }

      // Reload the page data by refetching documents would need a round trip;
      // for the demo we optimistically add the row and bump the chunk count.
      setDocuments((current) => [
        ...current,
        { id: `${Date.now()}`, filename: data.filename ?? file.name },
      ]);
      setIndexedChunks((current) => current + (data.chunks ?? 0));
      setIsUploading(false);
    } catch {
      setUploadError('Something went wrong. Please try again.');
      setIsUploading(false);
    }
  };

  const onFileInput = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      void handleFile(file);
    }
    event.target.value = '';
  };

  const askQuestion = async (question: string): Promise<void> => {
    const trimmed = question.trim();
    if (trimmed === '') {
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
    const question = String(formData.get('question') ?? '');
    void askQuestion(question);
    event.currentTarget.reset();
  };

  return (
    <main className="container">
      <div className="dash-card">
        <div className="dash-header">
          <span className="dash-header__brand">Dashboard</span>
          <span className="dash-header__bot">{botName}</span>
        </div>

        <h1 className="dash-title">Your bot is live 🎉</h1>
        <p className="dash-sub">
          Answering from {documents.length} document
          {documents.length === 1 ? '' : 's'} · {indexedChunks} chunks indexed
        </p>

        <div className="stat-grid">
          <div className="stat stat--purple">
            <span className="stat__label">Documents</span>
            <span className="stat__value">{documents.length}</span>
          </div>
          <div className="stat stat--green">
            <span className="stat__label">Chunks indexed</span>
            <span className="stat__value">{indexedChunks}</span>
          </div>
          <div className="stat stat--pink">
            <span className="stat__label">Status</span>
            <span className="stat__value">● Live</span>
          </div>
        </div>

        <div className="kb-head">
          <h2>Knowledge base</h2>
          <label htmlFor="dash-upload" className="btn btn--yellow">
            + Add document
          </label>
          <input
            id="dash-upload"
            type="file"
            accept=".md,.txt,.json"
            onChange={onFileInput}
            style={{ display: 'none' }}
          />
        </div>

        <label htmlFor="dash-upload" className="dropzone">
          {isUploading
            ? 'Uploading and indexing…'
            : 'Click to add a file — .md, .txt, .json'}
        </label>
        {uploadError ? <p className="error">{uploadError}</p> : null}

        <div className="doc-list">
          {documents.length === 0 ? (
            <p className="doc-empty">No documents yet. Add one to train your bot.</p>
          ) : (
            documents.map((doc) => (
              <div key={doc.id} className="doc-row">
                <span className="doc-row__name">📄 {doc.filename}</span>
                <span className="doc-row__status">● indexed</span>
              </div>
            ))
          )}
        </div>

        <div className="preview-panel">
          <h2 className="preview-panel__title">Preview your bot</h2>
          <p className="preview-panel__sub">
            Test questions before your customers do.
          </p>

          <div className="chat">
            {messages.length === 0 ? (
              <p className="chat__hint">
                Ask something your documents cover — or try “what’s the wifi
                password?” to see it refuse.
              </p>
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
            <label htmlFor="dash-question" className="sr-only">
              Ask your bot
            </label>
            <input
              id="dash-question"
              name="question"
              type="text"
              placeholder="Ask about your documents…"
              autoComplete="off"
              required
            />
            <button type="submit" className="btn btn--primary" disabled={isAsking}>
              Ask
            </button>
          </form>
        </div>
      </div>

      <div className="dash-footer">
        GrumpyBot · turn any document into a bot · made with ☕ and AI
      </div>
    </main>
  );
};