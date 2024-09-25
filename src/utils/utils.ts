export function strftime(date: Date, format: string): string {
  const pad = (num: number): string => num.toString().padStart(2, '0');

  const formats: { [key: string]: string } = {
    '%d': pad(date.getDate()),
    '%b': date.toLocaleString('default', { month: 'short' }),
    '%Y': date.getFullYear().toString()
  };

  return format.replace(/%[a-zA-Z]/g, (match) => formats[match] || match);
}
