export function readSession() {
  return JSON.parse(localStorage.getItem('weekend-wander-session') || 'null');
}

export function writeSession(session) {
  localStorage.setItem('weekend-wander-session', JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem('weekend-wander-session');
}

export function profileFromSession(session) {
  const name = session?.name || 'Wanderer';
  return { name, email: session?.email || '', initial: name.charAt(0).toUpperCase() };
}
