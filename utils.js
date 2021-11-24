const round = (input, decimals = 2) =>
  Math.round(input * 10 ** decimals) / 10 ** decimals;

const getArgument = (argName, isOptional = true) => {
  const args = process.argv.slice(2);
  const argIndex = args.indexOf(`--${argName}`);
  const argValue = args[argIndex + 1];

  if ((argIndex === -1 || !Boolean(argValue)) && !isOptional) {
    throw Error('Missing argument');
  }

  if (argIndex === -1) {
    return null;
  }

  if (!isNaN(Number(argValue))) {
    return Number(argValue);
  }

  return argValue;
};

module.exports = {
  round,
  getArgument,
};
