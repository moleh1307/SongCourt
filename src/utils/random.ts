export const hashSeed = (input: string) => {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
};

export const pickBySeed = <T>(items: T[], seed: string): T => items[hashSeed(seed) % items.length];
