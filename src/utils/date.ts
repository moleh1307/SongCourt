export const todayKey = () => new Date().toISOString().slice(0, 10);

export const formatDisplayDate = (value: string) =>
  new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(value));
