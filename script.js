const destinations = [
  { id: 'amalfi', name: 'Amalfi Coast', location: 'Italy', type: 'coast', label: 'Sun-soaked', description: 'Lemon groves, sea swims, and long lunches.', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=82' },
  { id: 'copenhagen', name: 'Copenhagen', location: 'Denmark', type: 'city', label: 'Design-forward', description: 'Bikes, bakeries, and very good people watching.', image: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=800&q=82' },
  { id: 'azores', name: 'São Miguel', location: 'Azores', type: 'nature', label: 'Wild & green', description: 'Volcanic lakes and hot springs under open skies.', image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=82' },
  { id: 'kyoto', name: 'Kyoto', location: 'Japan', type: 'city', label: 'Quietly magical', description: 'Temple walks, tiny bars, and gardens in bloom.', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=82' },
  { id: 'mallorca', name: 'Mallorca', location: 'Spain', type: 'coast', label: 'Blue hour', description: 'Mountain roads that end at a perfect cove.', image: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=800&q=82' },
  { id: 'lake-bled', name: 'Lake Bled', location: 'Slovenia', type: 'nature', label: 'Storybook', description: 'Alpine air, still water, and a tiny island.', image: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=800&q=82' },
  { id: 'lisbon', name: 'Lisbon', location: 'Portugal', type: 'city', label: 'Golden & easy', description: 'Tile-lined streets, custard tarts, late sunsets.', image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=800&q=82' },
  { id: 'scotland', name: 'The Highlands', location: 'Scotland', type: 'nature', label: 'Big skies', description: 'Misty lochs and a cabin with no notifications.', image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=82' }
];

const grid = document.querySelector('#destinationGrid');
const searchInput = document.querySelector('#searchInput');
const emptyState = document.querySelector('#emptyState');
const savedCount = document.querySelector('#savedCount');
let activeFilter = 'all';
let saved = JSON.parse(localStorage.getItem('weekend-wander-saved') || '[]');

function renderDestinations() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = destinations.filter((destination) => {
    const matchesFilter = activeFilter === 'all' || destination.type === activeFilter;
    const matchesQuery = !query || `${destination.name} ${destination.location} ${destination.label} ${destination.description}`.toLowerCase().includes(query);
    return matchesFilter && matchesQuery;
  });
  grid.innerHTML = filtered.map((destination) => `
    <article class="destination-card">
      <div class="destination-image">
        <img src="${destination.image}" alt="A view of ${destination.name}" loading="lazy" />
        <button class="save-card ${saved.includes(destination.id) ? 'saved' : ''}" data-save="${destination.id}" type="button" aria-label="${saved.includes(destination.id) ? 'Remove' : 'Save'} ${destination.name}">${saved.includes(destination.id) ? '♥' : '♡'}</button>
      </div>
      <div class="card-meta"><span>${destination.label}</span><span>${destination.type}</span></div>
      <h3>${destination.name}</h3><p>${destination.description}</p>
    </article>`).join('');
  emptyState.classList.toggle('hidden', filtered.length > 0);
  savedCount.textContent = saved.length;
}

function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2400);
}

document.querySelectorAll('.filter-pill').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('.filter-pill').forEach((pill) => pill.classList.remove('active'));
  button.classList.add('active'); activeFilter = button.dataset.filter; renderDestinations();
}));
searchInput.addEventListener('input', renderDestinations);
grid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-save]'); if (!button) return;
  const id = button.dataset.save;
  saved = saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id];
  localStorage.setItem('weekend-wander-saved', JSON.stringify(saved)); renderDestinations();
  showToast(saved.includes(id) ? 'Saved to your weekend list.' : 'Removed from your saved list.');
});

document.querySelector('#surpriseButton').addEventListener('click', () => {
  const pick = destinations[Math.floor(Math.random() * destinations.length)];
  searchInput.value = pick.name; activeFilter = 'all'; document.querySelectorAll('.filter-pill').forEach((pill) => pill.classList.toggle('active', pill.dataset.filter === 'all')); renderDestinations();
  document.querySelector('#discover').scrollIntoView({ behavior: 'smooth' }); showToast(`How about ${pick.name}?`);
});
document.querySelectorAll('[data-mood]').forEach((button) => button.addEventListener('click', () => {
  const moodMap = { slow: 'coast', curious: 'city', wild: 'nature' }; activeFilter = moodMap[button.dataset.mood];
  document.querySelectorAll('.filter-pill').forEach((pill) => pill.classList.toggle('active', pill.dataset.filter === activeFilter)); searchInput.value = ''; renderDestinations(); document.querySelector('#discover').scrollIntoView({ behavior: 'smooth' });
}));

document.querySelector('#savedNav').addEventListener('click', () => { searchInput.value = ''; activeFilter = 'all'; document.querySelectorAll('.filter-pill').forEach((pill) => pill.classList.toggle('active', pill.dataset.filter === 'all')); renderDestinations(); document.querySelector('#discover').scrollIntoView({ behavior: 'smooth' }); showToast(saved.length ? `${saved.length} saved escape${saved.length === 1 ? '' : 's'} waiting for you.` : 'Save a place to find it here.'); });
const modal = document.querySelector('#tripModal');
document.querySelector('#openModal').addEventListener('click', () => modal.classList.remove('hidden'));
document.querySelector('#modalSubmit').addEventListener('click', () => { activeFilter = document.querySelector('#modalMood').value; document.querySelectorAll('.filter-pill').forEach((pill) => pill.classList.toggle('active', pill.dataset.filter === activeFilter)); searchInput.value = ''; modal.classList.add('hidden'); renderDestinations(); document.querySelector('#discover').scrollIntoView({ behavior: 'smooth' }); });
document.querySelector('#closeModal').addEventListener('click', () => modal.classList.add('hidden'));
modal.addEventListener('click', (event) => { if (event.target === modal) modal.classList.add('hidden'); });
renderDestinations();
