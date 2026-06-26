'use client';

import { useState, type FormEvent } from 'react';

type ChatMessage = {
  role: 'user' | 'bot';
  text: string;
  sources?: string[];
};

const SUGGESTIONS = [
  'Loud latte on Tuesday?',
  'Can I bring my dog?',
  'Do you have blueberry muffins?',
  "What's the wifi password?",
];

const GREETING =
  "Well, well. Ask me about our rules, the menu, dogs, muffins, whatever. I only answer from the handbook though — don't get cute.";

export const GrumpyBeanChat = (): React.ReactElement => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAsking, setIsAsking] = useState(false);

  const ask = async (question: string): Promise<void> => {
    const trimmed = question.trim();
    if (trimmed === '' || isAsking) {
      return;
    }
    setMessages((current) => [...current, { role: 'user', text: trimmed }]);
    setIsAsking(true);

    try {
      const response = await fetch('/api/example/ask', {
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

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const question = String(formData.get('question') ?? '');
    void ask(question);
    event.currentTarget.reset();
  };

  return (
    <div className="bean-chat">
      <div className="bean-chat__window">
        <div className="bubble bubble--bot">
          <span className="bubble__text">{GREETING}</span>
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

        {messages.length === 0 ? (
          <div className="chip-row">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="chip"
                onClick={() => void ask(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <form className="bean-chat__form" onSubmit={onSubmit}>
        <label htmlFor="bean-question" className="sr-only">
          Ask the Grumpy Bean
        </label>
        <input
          id="bean-question"
          name="question"
          type="text"
          placeholder="Ask about our rules, menu, dogs…"
          autoComplete="off"
          required
        />
        <button type="submit" className="bean-chat__send" disabled={isAsking}>
          ↑
        </button>
      </form>
    </div>
  );
};