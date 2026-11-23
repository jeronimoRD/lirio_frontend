export function formatLikeCount(count: number): string {
  if (count < 1000) {
    return count.toString();
  }

  if (count < 1000000) {
    const value = count / 1000;
    if (value % 1 === 0) {
      return `${value} mil`;
    }
    // Show one decimal place like Instagram style
    const rounded = Math.floor(value * 10) / 10;
    return `${rounded} mil`;
  }

  const value = count / 1000000;
  if (value % 1 === 0) {
    return `${value} mill`;
  }
  const rounded = Math.floor(value * 10) / 10;
  return `${rounded} mill`;
}

const MONTHS = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
];

/** "ahora", "hace 5 min", "hace 3 h", "hace 2 d" o "12 nov". */
export function formatTimeAgo(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) {
    return 'ahora';
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `hace ${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `hace ${hours} h`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `hace ${days} d`;
  }

  return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

