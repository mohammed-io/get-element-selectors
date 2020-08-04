const isCSSIdentifier = (value: string) => /^-?[a-zA-Z_][a-zA-Z0-9_-]*$/.test(value);

const isCSSIdentChar = (c: string) => /[a-zA-Z0-9_-]/.test(c) || c.charCodeAt(0) >= 0xa0;

const toHexByte = (c: string) => {
  let hexByte = c.charCodeAt(0).toString(16);
  if (hexByte.length === 1) {
    hexByte = '0' + hexByte;
  }
  return hexByte;
};

const escapeAsciiChar = (c: string, isLast: boolean) => '\\' + toHexByte(c) + (isLast ? '' : ' ');

export const escapeIdentifierIfNeeded = (ident: string) => {
  if (isCSSIdentifier(ident)) {
    return ident;
  }

  const shouldEscapeFirst = /^(?:[0-9]|-[0-9-]?)/.test(ident);
  const lastIndex = ident.length - 1;
  return ident.replace(/./g, (c, i) => {
    return (shouldEscapeFirst && i === 0) || !isCSSIdentChar(c) ? escapeAsciiChar(c, i === lastIndex) : c;
  });
};
