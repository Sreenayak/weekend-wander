export function buildItinerary(destination) {
  const isLongTrip = destination.duration.startsWith('3');
  const days = [
    { number: '01', title: 'Arrive softly', text: `Start with ${destination.highlights[0].toLowerCase()} and let the first evening stay wonderfully open.` }
  ];
  if (isLongTrip) days.push({ number: '02', title: 'Go a little further', text: `Take the scenic route to ${destination.highlights[1].toLowerCase()}, then make time for a long lunch and an unhurried afternoon.` });
  days.push({ number: isLongTrip ? '03' : '02', title: 'Keep one thing for last', text: `Make time for ${destination.highlights[2].toLowerCase()}, a slow meal, and one view you will remember on Monday.` });
  return days;
}

export function itineraryText(destination) {
  return [`My ${destination.name} pocket itinerary`, ...buildItinerary(destination).map((day) => `${day.number} ${day.title}: ${day.text}`)].join('\n');
}
