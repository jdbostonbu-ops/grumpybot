'use client';

import { useState, type FormEvent } from 'react';

type ChatMessage = {
  role: 'user' | 'bot';
  text: string;
  sources?: string[];
};

type EmbedChatProps = {
  botId: string;
  greeting?: string;
};

export const EmbedChat = (props: EmbedChatProps): React.ReactElement => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAsking, setIsAsking] = useState(false);

  const greeting =
    props.greeting ??
    'Ask me anything about this project — I only answer from the uploaded documents.';

  const ask = async (question: string): Promise<void> => {
    const trimmed = question.trim();
    if (trimmed === '' || isAsking) {
      return;
    }
    setMessages((current) => [...current, { role: 'user', text: trimmed }]);
    setIsAsking(true);
    try {
      const response = await fetch('/api/embed/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botId: props.botId, question: trimmed }),
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

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const question = String(formData.get('question') ?? '');
    void ask(question);
    event.currentTarget.reset();
  };

  return (
    <div className="embed-chat">
      <div className="embed-chat__window">
        <div className="bubble bubble--bot">
          <span className="bubble__text">{greeting}</span>
        </div>
        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.role === 'user' ? 'bubble bubble--user' : 'bubble bubble--bot'
            }
          >
            <span className="bubble__text">{message.text}</span>
            {message.sources && message.sources.length > 0 ? (
              <span className="bubble__sources">
                Sources: {message.sources.join(', ')}
              </span>
            ) : null}
          </div>
        ))}
        {isAsking ? <div className="bubble bubble--bot">Thinking…</div> : null}
      </div>
      <form className="embed-chat__form" onSubmit={onSubmit}>
        <label htmlFor="embed-question" className="sr-only">
          Ask the bot
        </label>
        <input
          id="embed-question"
          name="question"
          type="text"
          placeholder="Ask a question…"
          autoComplete="off"
          required
        />
        <button type="submit" className="embed-chat__send" disabled={isAsking}>
          ↑
        </button>
      </form>
    </div>
  );
};
