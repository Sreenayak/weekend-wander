export function matchesDestination(destination, { query = '', filter = 'all', duration = 'all', budget = 'all', savedOnly = false, saved = [] }) {
  const normalizedQuery = query.trim().toLowerCase();
  const matchesFilter = filter === 'all' || destination.type === filter;
  const searchable = `${destination.name} ${destination.location} ${destination.label} ${destination.description}`.toLowerCase();
  const matchesQuery = !normalizedQuery || searchable.includes(normalizedQuery);
  const matchesDuration = duration === 'all' || destination.duration.startsWith(duration);
  const matchesBudget = budget === 'all' || (budget === 'low' && destination.price < 400) || (budget === 'mid' && destination.price >= 400 && destination.price <= 600) || (budget === 'high' && destination.price > 600);
  return matchesFilter && matchesQuery && matchesDuration && matchesBudget && (!savedOnly || saved.includes(destination.id));
}

export function sortDestinations(items, sort = 'featured') {
  return [...items].sort((first, second) => {
    if (sort === 'name') return first.name.localeCompare(second.name);
    if (sort === 'shortest') return Number(first.duration[0]) - Number(second.duration[0]);
    if (sort === 'budget') return first.budget.length - second.budget.length;
    return 0;
  });
}

export function destinationCard(destination, saved) {
  const isSaved = saved.includes(destination.id);
  return `<article class="destination-card"><div class="destination-image"><img src="${destination.image}" alt="A view of ${destination.name}" loading="lazy" /><button class="save-card ${isSaved ? 'saved' : ''}" data-save="${destination.id}" type="button" aria-label="${isSaved ? 'Remove' : 'Save'} ${destination.name}">${isSaved ? '♥' : '♡'}</button></div><div class="card-meta"><span>${destination.label}</span><span>${destination.type}</span></div><h3>${destination.name}</h3><p>${destination.description}</p><div class="card-price"><span>from</span><strong>$${destination.price}</strong><small>per person</small></div><button class="guide-link" data-guide="${destination.id}" type="button">View destination details <span>↗</span></button></article>`;
}
