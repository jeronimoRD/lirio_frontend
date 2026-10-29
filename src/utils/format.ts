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
