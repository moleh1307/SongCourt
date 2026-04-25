export const clampScore = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export const severityLabel = (score: number) => {
  if (score <= 20) return 'Safe';
  if (score <= 40) return 'Mildly Suspicious';
  if (score <= 60) return 'Questionable';
  if (score <= 80) return 'Dangerous';
  return 'Illegal Aux Behavior';
};

export const severityTone = (score: number) => {
  if (score <= 40) return 'safe';
  if (score <= 60) return 'suspicious';
  if (score <= 80) return 'dangerous';
  return 'illegal';
};
