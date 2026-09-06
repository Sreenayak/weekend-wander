const destinations = [
  { id: 'amalfi', name: 'Amalfi Coast', location: 'Italy', type: 'coast', label: 'Sun-soaked', description: 'Lemon groves, sea swims, and long lunches.', duration: '3 days', budget: '$$$', price: 680, best: 'May–September', highlights: ['Ravello gardens', 'Sunset boat ride', 'Lemon granita'], image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=82' },
  { id: 'copenhagen', name: 'Copenhagen', location: 'Denmark', type: 'city', label: 'Design-forward', description: 'Bikes, bakeries, and very good people watching.', duration: '2 days', budget: '$$', price: 420, best: 'April–October', highlights: ['Canal-side cycling', 'Nørrebro bakeries', 'Louisiana Museum'], image: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=800&q=82' },
  { id: 'azores', name: 'São Miguel', location: 'Azores', type: 'nature', label: 'Wild & green', description: 'Volcanic lakes and hot springs under open skies.', duration: '3 days', budget: '$$', price: 510, best: 'June–October', highlights: ['Sete Cidades lake', 'Furnas hot springs', 'Ponta Delgada'], image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=82' },
  { id: 'kyoto', name: 'Kyoto', location: 'Japan', type: 'city', label: 'Quietly magical', description: 'Temple walks, tiny bars, and gardens in bloom.', duration: '3 days', budget: '$$$', price: 790, best: 'March–May', highlights: ['Fushimi Inari dawn', 'Gion backstreets', 'Tea house afternoon'], image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=82' },
  { id: 'mallorca', name: 'Mallorca', location: 'Spain', type: 'coast', label: 'Blue hour', description: 'Mountain roads that end at a perfect cove.', duration: '3 days', budget: '$$', price: 460, best: 'May–October', highlights: ['Deià swim', 'Tramuntana drive', 'Palma old town'], image: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=800&q=82' },
  { id: 'lake-bled', name: 'Lake Bled', location: 'Slovenia', type: 'nature', label: 'Storybook', description: 'Alpine air, still water, and a tiny island.', duration: '2 days', budget: '$', price: 295, best: 'May–October', highlights: ['Lake loop walk', 'Island boat ride', 'Vintgar Gorge'], image: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=800&q=82' },
  { id: 'lisbon', name: 'Lisbon', location: 'Portugal', type: 'city', label: 'Golden & easy', description: 'Tile-lined streets, custard tarts, late sunsets.', duration: '2 days', budget: '$$', price: 360, best: 'All year', highlights: ['Tram 28 ride', 'Alfama sunset', 'Pastéis de nata'], image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=800&q=82' },
  { id: 'scotland', name: 'The Highlands', location: 'Scotland', type: 'nature', label: 'Big skies', description: 'Misty lochs and a cabin with no notifications.', duration: '3 days', budget: '$$', price: 540, best: 'April–September', highlights: ['Loch Ness drive', 'Glen Coe hike', 'Cabin fire'], image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=82' }
];

const grid = document.querySelector('#destinationGrid');
const searchInput = document.querySelector('#searchInput');
const emptyState = document.querySelector('#emptyState');
const savedCount = document.querySelector('#savedCount');
const planSummary = document.querySelector('#planSummary');
const sortSelect = document.querySelector('#sortSelect');
const recommendationGrid = document.querySelector('#recommendationGrid');
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
  const query = searchInput.value.trim().toLowerCase();
  const filtered = destinations.filter((destination) => {
    const matchesFilter = activeFilter === 'all' || destination.type === activeFilter;
    const matchesQuery = !query || `${destination.name} ${destination.location} ${destination.label} ${destination.description}`.toLowerCase().includes(query);
    const matchesDuration = matchDuration === 'all' || destination.duration.startsWith(matchDuration);
    const matchesBudget = matchBudget === 'all' || (matchBudget === 'low' && destination.price < 400) || (matchBudget === 'mid' && destination.price >= 400 && destination.price <= 600) || (matchBudget === 'high' && destination.price > 600);
    return matchesFilter && matchesQuery && matchesDuration && matchesBudget && (!showSavedOnly || saved.includes(destination.id));
  }).sort((first, second) => {
    if (sortSelect.value === 'name') return first.name.localeCompare(second.name);
    if (sortSelect.value === 'shortest') return Number(first.duration[0]) - Number(second.duration[0]);
    if (sortSelect.value === 'budget') return first.budget.length - second.budget.length;
    return 0;
  });
  grid.innerHTML = filtered.map((destination) => `
    <article class="destination-card">
      <div class="destination-image">
        <img src="${destination.image}" alt="A view of ${destination.name}" loading="lazy" />
        <button class="save-card ${saved.includes(destination.id) ? 'saved' : ''}" data-save="${destination.id}" type="button" aria-label="${saved.includes(destination.id) ? 'Remove' : 'Save'} ${destination.name}">${saved.includes(destination.id) ? '♥' : '♡'}</button>
      </div>
      <div class="card-meta"><span>${destination.label}</span><span>${destination.type}</span></div>
      <h3>${destination.name}</h3><p>${destination.description}</p><div class="card-price"><span>from</span><strong>$${destination.price}</strong><small>per person</small></div><button class="guide-link" data-guide="${destination.id}" type="button">View mini guide <span>↗</span></button>
    </article>`).join('');
  emptyState.classList.toggle('hidden', filtered.length > 0);
  savedCount.textContent = saved.length;
  planSummary.textContent = saved.length ? `${saved.length} place${saved.length === 1 ? '' : 's'} saved for later` : 'Nothing saved yet';
  document.querySelector('#matchResult').textContent = `${filtered.length} escape${filtered.length === 1 ? '' : 's'} to explore`;
  renderRecommendations();
}

function renderRecommendations() {
  const scored = destinations.map((destination) => {
    let score = 0;
    if (activeFilter !== 'all' && destination.type === activeFilter) score += 4;
    if (matchDuration !== 'all' && destination.duration.startsWith(matchDuration)) score += 3;
    if (matchBudget !== 'all' && ((matchBudget === 'low' && destination.price < 400) || (matchBudget === 'mid' && destination.price >= 400 && destination.price <= 600) || (matchBudget === 'high' && destination.price > 600))) score += 3;
    if (saved.some((id) => destinations.find((item) => item.id === id)?.type === destination.type)) score += 2;
    if (searchInput.value.trim() && `${destination.name} ${destination.location} ${destination.label}`.toLowerCase().includes(searchInput.value.trim().toLowerCase())) score += 5;
    return { destination, score };
  }).sort((first, second) => second.score - first.score || first.destination.name.localeCompare(second.destination.name)).slice(0, 3);
  recommendationGrid.innerHTML = scored.map(({ destination }) => `<article class="recommendation-card"><img src="${destination.image}" alt="${destination.name}" loading="lazy" /><div class="recommendation-card-content"><span>${destination.label}</span><h4>${destination.name}</h4><p>${destination.description}</p><button class="recommendation-link" data-recommend="${destination.id}" type="button">Explore guide ↗</button></div></article>`).join('');
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
recommendationGrid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-recommend]');
  if (button) openDetail(button.dataset.recommend);
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
  const dayTwo = destination.duration.startsWith('3') ? `<article class="itinerary-day"><span>02</span><div><b>Go a little further</b><p>Take the scenic route to ${destination.highlights[1].toLowerCase()}, then make time for a long lunch and an unhurried afternoon.</p></div></article>` : '';
  document.querySelector('#itineraryTitle').textContent = `${destination.name}, your way`;
  document.querySelector('#itineraryIntro').textContent = `A gentle ${destination.duration} rhythm, built around the good parts of ${destination.location}.`;
  document.querySelector('#itineraryDays').innerHTML = `<article class="itinerary-day"><span>01</span><div><b>Arrive softly</b><p>Start with ${destination.highlights[0].toLowerCase()} and let the first evening stay wonderfully open.</p></div></article>${dayTwo}<article class="itinerary-day"><span>${destination.duration.startsWith('3') ? '03' : '02'}</span><div><b>Keep one thing for last</b><p>Make time for ${destination.highlights[2].toLowerCase()}, a slow meal, and one view you will remember on Monday.</p></div></article>`;
  document.querySelector('#detailModal').classList.add('hidden');
  document.querySelector('#itineraryModal').classList.remove('hidden');
});
document.querySelector('#closeItinerary').addEventListener('click', () => document.querySelector('#itineraryModal').classList.add('hidden'));
document.querySelector('#copyItinerary').addEventListener('click', async () => {
  if (!itineraryDestination) return;
  const text = `My ${itineraryDestination.name} pocket itinerary\n01 Arrive softly: ${itineraryDestination.highlights[0]}\n${itineraryDestination.duration.startsWith('3') ? `02 Go a little further: ${itineraryDestination.highlights[1]}\n` : ''}${itineraryDestination.duration.startsWith('3') ? '03' : '02'} Keep one thing for last: ${itineraryDestination.highlights[2]}`;
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
  const session = JSON.parse(localStorage.getItem('weekend-wander-session') || '{}');
  const name = session.name || 'Wanderer';
  profileName.textContent = name;
  profileEmail.textContent = session.email || '';
  profileInitial.textContent = name.charAt(0).toUpperCase();
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
  localStorage.setItem('weekend-wander-session', JSON.stringify({ email, name, mode: authMode }));
  showToast(`Welcome${name ? `, ${name}` : ''}. Your next escape is ready.`);
  showApp();
});

document.querySelector('#signOut').addEventListener('click', () => {
  localStorage.removeItem('weekend-wander-session');
  profileDropdown.hidden = true;
  profileButton.setAttribute('aria-expanded', 'false');
  showAuth();
  authForm.reset();
  window.scrollTo({ top: 0, behavior: 'smooth' });
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

// Let guests explore the destination experience before creating an account.
showApp();
renderDestinations();
