export function truncateMessage(message: string, maxLength: number = 50) {
  const firstLine = message.split('\n')[0];
  return firstLine.length > maxLength ? firstLine.substring(0, maxLength) + '...' : firstLine;
}
