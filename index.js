const {
  hexToHsl,
  hslToHex,
  hslToRgbString,
  hslToHslString,
} = require('./color-utils');
const { round, getArgument } = require('./utils');

const lightnesses = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
const shades = lightnesses.map(l => 1000 - l);

const getColorLightnessPosition = ([, , l]) => {
  const { stepsCountToWhite, closestLightness, closestLightnessIndex } =
    shades.reduce(
      (acc, shade, index) => {
        const lightness = 1000 - shade;

        if (
          acc.closestLightnessIndex === -1 ||
          Math.abs(shade - 1000 * l) < Math.abs(acc.closestLightness - 1000 * l)
        ) {
          return {
            closestLightness: lightness,
            stepsCountToWhite: acc.stepsCountToWhite + 1,
            closestLightnessIndex: index,
          };
        }
        return acc;
      },
      {
        closestLightness: null,
        stepsCountToWhite: 0,
        closestLightnessIndex: -1,
      },
    );

  const stepsCountToBlack = 11 - stepsCountToWhite;

  return {
    closestLightness,
    closestLightnessIndex,
    stepsCountToBlack,
    stepsCountToWhite,
  };
};

const formatColorArgument = color => {
  if (!Boolean(color)) {
    throw Error('');
  }

  if (/^#([\da-fA-F]{4}){1,2}$/.test(color)) {
    throw Error(`Please provide an opaque entry value`);
  }

  if (!/^#([\da-fA-F]{3}){1,2}$/.test(color)) {
    throw Error(`${color} is not a valid hexadecimal color`);
  }

  if (/^#[\da-fA-F]{3}$/.test(color)) {
    color = color
      .slice(1)
      .split('')
      .reduce((acc, c) => `${acc}${c}${c}`, '#');
  }

  return hexToHsl(color);
};

const generatePalette = ({ color, format }) => {
  const [h, s, l] = formatColorArgument(color);

  const {
    closestLightness,
    closestLightnessIndex,
    stepsCountToBlack,
    stepsCountToWhite,
  } = getColorLightnessPosition([h, s, l]);

  const lightnessStepToBlack = l / stepsCountToBlack;
  const lightnessStepToWhite = round((1 - l) / stepsCountToWhite);

  const palette = shades
    .map((shade, index) => {
      const lightness = 1000 - shade;
      if (index <= closestLightnessIndex) {
        return {
          lightness,
          hsl: [
            h,
            s,
            round(
              l + (closestLightnessIndex - index) * lightnessStepToWhite,
              2,
            ),
          ],
        };
      }
      return {
        lightness,
        hsl: [
          h,
          s,
          round(l - (index - closestLightnessIndex) * lightnessStepToBlack, 2),
        ],
      };
    })
    .map(({ lightness, hsl }) => {
      let value;
      switch (format) {
        case 'hsl':
          value = hslToHslString(hsl);
          break;
        case 'rgb':
          value = hslToRgbString(hsl);
          break;
        case 'hex':
        default:
          value = lightness === closestLightness ? color : hslToHex(hsl);
          break;
      }

      return {
        lightness,
        value,
      };
    });

  return palette.reduce(
    (acc, { lightness, value }) => ({
      ...acc,
      [lightness]: value,
    }),
    {},
  );
};

const run = () => {
  try {
    const color = getArgument('color');
    const format = getArgument('format') || 'hex';

    console.log(
      generatePalette({
        color,
        format,
      }),
    );
  } catch (err) {
    if (Boolean(err.message)) {
      console.log(`\x1b[31m⚠️  ${err.message}\x1b[0m`);
      console.log(``);
    }
    console.log(
      `ℹ️  Usage: node index.js --color COLOR_CODE [--mode hsl|rgb|hex]`,
    );
    console.log(`\x1b[2m     e.g. node index.js --color #ea1863`);
    console.log(`          node index.js --color #ea1863 --output hsl`);
  }
};

run();
