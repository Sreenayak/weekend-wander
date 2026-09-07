import { destinations as catalog } from './data/destinations.js';
import { destinationCard, matchesDestination, sortDestinations } from './components/discovery.js';
import { clearSession, profileFromSession, readSession, writeSession } from './components/auth.js';
import { buildItinerary, itineraryText } from './components/planner.js';

const destinations = catalog;
const grid = document.querySelector('#destinationGrid');
const searchInput = document.querySelector('#searchInput');
const emptyState = document.querySelector('#emptyState');
const savedCount = document.querySelector('#savedCount');
const planSummary = document.querySelector('#planSummary');
const sortSelect = document.querySelector('#sortSelect');
const authScreen = document.querySelector('#authScreen');
const appShell = document.querySelector('#appShell');
const authForm = document.querySelector('#authForm');
const authError = document.querySelector('#authError');
const nameField = document.querySelector('#nameField');
const authName = document.querySelector('#authName');
const profileButton = document.querySelector('#profileButton');
const profileDropdown = document.querySelector('#profileDropdown');
const profileInitial = document.querySelector('#profileInitial');
const profileName = document.querySelector('#profileName');
const profileEmail = document.querySelector('#profileEmail');
let authMode = 'signin';
let activeFilter = 'all';
let showSavedOnly = false;
let matchDuration = 'all';
let matchBudget = 'all';
let itineraryDestination = null;
let saved = JSON.parse(localStorage.getItem('weekend-wander-saved') || '[]');

function renderDestinations() {
  const filtered = sortDestinations(destinations.filter((destination) => matchesDestination(destination, { query: searchInput.value, filter: activeFilter, duration: matchDuration, budget: matchBudget, savedOnly: showSavedOnly, saved })), sortSelect.value);
  grid.innerHTML = filtered.map((destination) => destinationCard(destination, saved)).join('');
  emptyState.classList.toggle('hidden', filtered.length > 0);
  savedCount.textContent = saved.length;
  planSummary.textContent = saved.length ? `${saved.length} place${saved.length === 1 ? '' : 's'} saved for later` : 'Nothing saved yet';
  document.querySelector('#matchResult').textContent = `${filtered.length} escape${filtered.length === 1 ? '' : 's'} to explore`;
}

function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2400);
}

document.querySelectorAll('.filter-pill').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('.filter-pill').forEach((pill) => pill.classList.remove('active'));
  button.classList.add('active'); activeFilter = button.dataset.filter; showSavedOnly = false; renderDestinations();
}));
searchInput.addEventListener('input', renderDestinations);
sortSelect.addEventListener('change', renderDestinations);
document.querySelectorAll('[data-duration]').forEach((button) => button.addEventListener('click', () => {
  matchDuration = button.dataset.duration;
  document.querySelectorAll('[data-duration]').forEach((option) => option.classList.toggle('active', option === button));
  renderDestinations();
}));
document.querySelectorAll('[data-budget]').forEach((button) => button.addEventListener('click', () => {
  matchBudget = button.dataset.budget;
  document.querySelectorAll('[data-budget]').forEach((option) => option.classList.toggle('active', option === button));
  renderDestinations();
}));
document.querySelector('#resetMatch').addEventListener('click', () => {
  matchDuration = 'all'; matchBudget = 'all';
  document.querySelectorAll('.match-option').forEach((option) => option.classList.toggle('active', option.dataset.duration === 'all' || option.dataset.budget === 'all'));
  renderDestinations(); showToast('Match filters reset.');
});
grid.addEventListener('click', (event) => {
  const guideButton = event.target.closest('[data-guide]');
  if (guideButton) return openDetail(guideButton.dataset.guide);
  const button = event.target.closest('[data-save]'); if (!button) return;
  const id = button.dataset.save;
  saved = saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id];
  localStorage.setItem('weekend-wander-saved', JSON.stringify(saved)); renderDestinations();
  showToast(saved.includes(id) ? 'Saved to your weekend list.' : 'Removed from your saved list.');
});

function openDetail(id) {
  const destination = destinations.find((item) => item.id === id);
  document.querySelector('#detailImage').style.backgroundImage = `url("${destination.image}")`;
  document.querySelector('#detailLabel').textContent = `${destination.label} · ${destination.location}`;
  document.querySelector('#detailTitle').textContent = destination.name;
  document.querySelector('#detailDescription').textContent = destination.description;
  document.querySelector('#detailFacts').innerHTML = `<span><b>$${destination.price}</b> per person</span><span><b>${destination.duration}</b> trip length</span><span><b>${destination.best}</b> best time</span>`;
  document.querySelector('#detailHighlights').innerHTML = destination.highlights.map((highlight) => `<span>✦ ${highlight}</span>`).join('');
  const saveButton = document.querySelector('#detailSave');
  saveButton.textContent = saved.includes(id) ? 'Remove from my plan' : 'Add to my plan';
  saveButton.dataset.saveDetail = id;
  document.querySelector('#itineraryButton').dataset.itinerary = id;
  document.querySelector('#detailModal').classList.remove('hidden');
}

document.querySelector('#detailSave').addEventListener('click', (event) => {
  const id = event.currentTarget.dataset.saveDetail;
  saved = saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id];
  localStorage.setItem('weekend-wander-saved', JSON.stringify(saved)); renderDestinations(); openDetail(id);
  showToast(saved.includes(id) ? 'Added to your weekend plan.' : 'Removed from your weekend plan.');
});

document.querySelector('#surpriseButton').addEventListener('click', () => {
  const pick = destinations[Math.floor(Math.random() * destinations.length)];
  searchInput.value = pick.name; activeFilter = 'all'; showSavedOnly = false; document.querySelectorAll('.filter-pill').forEach((pill) => pill.classList.toggle('active', pill.dataset.filter === 'all')); renderDestinations();
  document.querySelector('#discover').scrollIntoView({ behavior: 'smooth' }); showToast(`How about ${pick.name}?`);
});
document.querySelectorAll('[data-mood]').forEach((button) => button.addEventListener('click', () => {
  const moodMap = { slow: 'coast', curious: 'city', wild: 'nature' }; activeFilter = moodMap[button.dataset.mood]; showSavedOnly = false;
  document.querySelectorAll('.filter-pill').forEach((pill) => pill.classList.toggle('active', pill.dataset.filter === activeFilter)); searchInput.value = ''; renderDestinations(); document.querySelector('#discover').scrollIntoView({ behavior: 'smooth' });
}));

document.querySelector('#savedNav').addEventListener('click', () => { searchInput.value = ''; activeFilter = 'all'; showSavedOnly = !showSavedOnly; document.querySelectorAll('.filter-pill').forEach((pill) => pill.classList.toggle('active', pill.dataset.filter === 'all')); renderDestinations(); document.querySelector('#discover').scrollIntoView({ behavior: 'smooth' }); showToast(showSavedOnly ? (saved.length ? `${saved.length} saved escape${saved.length === 1 ? '' : 's'} waiting for you.` : 'Save a place to find it here.') : 'Showing all escapes again.'); });
document.querySelector('#planButton').addEventListener('click', () => { renderPlan(); document.querySelector('#planModal').classList.remove('hidden'); });
document.querySelector('#closePlan').addEventListener('click', () => document.querySelector('#planModal').classList.add('hidden'));
document.querySelector('#closeDetail').addEventListener('click', () => document.querySelector('#detailModal').classList.add('hidden'));
document.querySelector('#itineraryButton').addEventListener('click', (event) => {
  const destination = destinations.find((item) => item.id === event.currentTarget.dataset.itinerary);
  itineraryDestination = destination;
  document.querySelector('#itineraryTitle').textContent = `${destination.name}, your way`;
  document.querySelector('#itineraryIntro').textContent = `A gentle ${destination.duration} rhythm, built around the good parts of ${destination.location}.`;
  document.querySelector('#itineraryDays').innerHTML = buildItinerary(destination).map((day) => `<article class="itinerary-day"><span>${day.number}</span><div><b>${day.title}</b><p>${day.text}</p></div></article>`).join('');
  document.querySelector('#detailModal').classList.add('hidden');
  document.querySelector('#itineraryModal').classList.remove('hidden');
});
document.querySelector('#closeItinerary').addEventListener('click', () => document.querySelector('#itineraryModal').classList.add('hidden'));
document.querySelector('#copyItinerary').addEventListener('click', async () => {
  if (!itineraryDestination) return;
  const text = itineraryText(itineraryDestination);
  try { await navigator.clipboard.writeText(text); showToast('Pocket itinerary copied.'); } catch { showToast('Your itinerary is ready to save.'); }
});
document.querySelectorAll('.modal-backdrop').forEach((backdrop) => backdrop.addEventListener('click', (event) => { if (event.target === backdrop) backdrop.classList.add('hidden'); }));
document.addEventListener('keydown', (event) => { if (event.key !== 'Escape') return; document.querySelectorAll('.modal-backdrop').forEach((modalElement) => modalElement.classList.add('hidden')); });
function renderPlan() {
  const planItems = destinations.filter((destination) => saved.includes(destination.id));
  document.querySelector('#planDescription').textContent = planItems.length ? 'Keep a few options here while you decide where the weekend is taking you.' : 'Save a destination from any card and it will appear here as your shortlist.';
  document.querySelector('#planList').innerHTML = planItems.length ? planItems.map((destination) => `<div class="plan-item"><span class="plan-thumb" style="background-image:url('${destination.image}')"></span><span><b>${destination.name}</b><small>from $${destination.price} · ${destination.duration}</small></span><button data-plan-remove="${destination.id}" type="button" aria-label="Remove ${destination.name}">×</button></div>`).join('') : '<div class="plan-empty">Your shortlist is waiting for its first place.</div>';
}
document.querySelector('#planList').addEventListener('click', (event) => { const button = event.target.closest('[data-plan-remove]'); if (!button) return; saved = saved.filter((id) => id !== button.dataset.planRemove); localStorage.setItem('weekend-wander-saved', JSON.stringify(saved)); renderDestinations(); renderPlan(); });
document.querySelector('#copyPlan').addEventListener('click', async () => { const names = destinations.filter((destination) => saved.includes(destination.id)).map((destination) => destination.name).join(', '); if (!names) return showToast('Save a place before copying your plan.'); try { await navigator.clipboard.writeText(`My Weekend Wander shortlist: ${names}`); showToast('Shortlist copied to your clipboard.'); } catch { showToast('Your shortlist is ready to copy.'); } });
const modal = document.querySelector('#tripModal');
document.querySelector('#openModal').addEventListener('click', () => modal.classList.remove('hidden'));
document.querySelector('#modalSubmit').addEventListener('click', () => { activeFilter = document.querySelector('#modalMood').value; showSavedOnly = false; document.querySelectorAll('.filter-pill').forEach((pill) => pill.classList.toggle('active', pill.dataset.filter === activeFilter)); searchInput.value = ''; modal.classList.add('hidden'); renderDestinations(); document.querySelector('#discover').scrollIntoView({ behavior: 'smooth' }); });
document.querySelector('#closeModal').addEventListener('click', () => modal.classList.add('hidden'));
modal.addEventListener('click', (event) => { if (event.target === modal) modal.classList.add('hidden'); });

function showApp() {
  updateProfile();
  authScreen.classList.add('auth-hidden');
  appShell.classList.add('is-visible');
  window.setTimeout(() => { authScreen.hidden = true; initScrollReveals(); }, 450);
}

function updateProfile() {
  const profile = profileFromSession(readSession());
  profileName.textContent = profile.name;
  profileEmail.textContent = profile.email;
  profileInitial.textContent = profile.initial;
}

function showAuth() {
  authScreen.hidden = false;
  authScreen.classList.remove('auth-hidden');
  appShell.classList.remove('is-visible');
}

function initScrollReveals() {
  const revealItems = document.querySelectorAll('.discover-section .section-heading, .filter-bar, .plan-strip, .destination-card, .collection-band .section-heading, .mood-card, .how-section > h2, .steps > div');
  revealItems.forEach((item) => item.classList.add('reveal-on-scroll'));
  if (!('IntersectionObserver' in window)) return revealItems.forEach((item) => item.classList.add('is-revealed'));
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => { if (!entry.isIntersecting) return; entry.target.classList.add('is-revealed'); currentObserver.unobserve(entry.target); });
  }, { threshold: .12 });
  revealItems.forEach((item) => observer.observe(item));
}

document.querySelectorAll('[data-auth-mode]').forEach((tab) => tab.addEventListener('click', () => {
  authMode = tab.dataset.authMode;
  document.querySelectorAll('[data-auth-mode]').forEach((authTab) => authTab.classList.toggle('active', authTab === tab));
  nameField.classList.toggle('hidden', authMode !== 'signup');
  authName.required = authMode === 'signup';
  document.querySelector('#authSubmit').innerHTML = authMode === 'signup' ? 'Create my account <span>↗</span>' : 'Continue to Weekend Wander <span>↗</span>';
  authError.textContent = '';
}));

authForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.querySelector('#authEmail').value.trim();
  const password = document.querySelector('#authPassword').value;
  const name = authName.value.trim() || email.split('@')[0];
  if (!email || !email.includes('@')) return void (authError.textContent = 'Please enter a valid email address.');
  if (password.length < 6) return void (authError.textContent = 'Your password needs at least 6 characters.');
  if (authMode === 'signup' && name.length < 2) return void (authError.textContent = 'Tell us your name so we know what to call you.');
  writeSession({ email, name, mode: authMode });
  showToast(`Welcome${name ? `, ${name}` : ''}. Your next escape is ready.`);
  showApp();
});

document.querySelector('#signOut').addEventListener('click', () => {
  clearSession();
  profileDropdown.hidden = true;
  profileButton.setAttribute('aria-expanded', 'false');
  showAuth();
  authForm.reset();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.querySelector('#guestAccess').addEventListener('click', () => {
  writeSession({ email: 'guest@weekendwander.local', name: 'Guest Wanderer', mode: 'guest' });
  showApp();
  showToast('Welcome in. Explore freely, save anything you like.');
});

profileButton.addEventListener('click', (event) => {
  event.stopPropagation();
  const isOpen = profileDropdown.hidden;
  profileDropdown.hidden = !isOpen;
  profileButton.setAttribute('aria-expanded', String(isOpen));
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.profile-menu')) {
    profileDropdown.hidden = true;
    profileButton.setAttribute('aria-expanded', 'false');
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  profileDropdown.hidden = true;
  profileButton.setAttribute('aria-expanded', 'false');
});

if (readSession()) showApp();
renderDestinations();
