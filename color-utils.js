const { round } = require('./utils');

const hexToRgb = hex =>
  hex
    .slice(1)
    .match(/[\da-fA-F]{2}/g)
    .map(x => parseInt(x, 16));

const rgbToHex = chunks =>
  `#${chunks.map(chunk => chunk.toString(16).padStart(2, '0')).join('')}`;

const rgbToHsl = ([r, g, b]) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  const h =
    delta === 0
      ? 0
      : (max === r
          ? (g - b) / delta + (g < b ? 6 : 0)
          : max === g
          ? (b - r) / delta + 2
          : (r - g) / delta + 4) * 60;

  return [round(h, 0), round(s), round(l)];
};

const hslToRgb = ([h, s, l]) => {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  const addM = value => round((value + m) * 255, 0);

  if (h < 60) {
    return [addM(c), addM(x), addM(0)];
  }
  if (h < 120) {
    return [addM(x), addM(c), addM(0)];
  }
  if (h < 180) {
    return [addM(0), addM(c), addM(x)];
  }
  if (h < 240) {
    return [addM(0), addM(x), addM(c)];
  }
  if (h < 300) {
    return [addM(x), addM(0), addM(c)];
  }
  return [addM(c), addM(0), addM(x)];
};

const hexToHsl = hex => rgbToHsl(hexToRgb(hex));
const hslToHex = hsl => rgbToHex(hslToRgb(hsl));

const hslToRgbString = hsl => `rgb(${hslToRgb(hsl).join(', ')})`;
const hslToHslString = hsl => `hsl(${hsl.join(', ')})`;

module.exports = {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  hexToHsl,
  hslToHex,
  hslToRgbString,
  hslToHslString,
};
