const convert = options =>
  Object.entries(options).map(([key, val]) => ({
    value: key,
    text: val,
  }));

const LineBreakModeOptions = convert({
  0: 'Word Wrap',
  1: 'Character Wrap',
  2: 'Clip',
  3: 'Truncate Head',
  4: 'Truncate Middle',
  5: 'Truncate Tail',
});

const BaselineOptions = convert({
  0: 'Align Baselines',
  1: 'Align Centers',
  2: 'None',
});

export { LineBreakModeOptions, BaselineOptions };
