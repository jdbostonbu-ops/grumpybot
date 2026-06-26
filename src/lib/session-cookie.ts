// The session cookie name lives in its own file with no Node dependencies,
// so the Edge-runtime middleware can import it without pulling in node:crypto.
export const SESSION_COOKIE_NAME = 'hb_session';