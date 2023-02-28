export const toPascalCase = (sentence: string) =>
  sentence
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace('_', ' ')
    .trim()
    .split(' ')
    .map((word) => word[0].toUpperCase().concat(word.slice(1)))
    .join(' ');
