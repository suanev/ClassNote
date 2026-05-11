export const toTestIdSegment = (value: string) => {
  const normalized = value.normalize('NFD').toLowerCase();
  let result = '';
  let lastWasHyphen = false;

  for (const char of normalized) {
    const code = char.charCodeAt(0);
    const isDigit = code >= 48 && code <= 57;
    const isLowercaseLetter = code >= 97 && code <= 122;

    if (code >= 0x0300 && code <= 0x036f) {
      continue;
    }

    if (isDigit || isLowercaseLetter) {
      result += char;
      lastWasHyphen = false;
      continue;
    }

    if (!lastWasHyphen && result.length > 0) {
      result += '-';
      lastWasHyphen = true;
    }
  }

  return lastWasHyphen ? result.slice(0, -1) : result;
};
