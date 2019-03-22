// case noAttribute 0
// case left 1
// case right 2
// case top 3
// case bottom 4
// case leading 5
// case trailing 6
// case width 7
// case height 8
// case centerX 9
// case centerY 10
// case lastBaseline 11
// case firstBaseline 12
// case leftMargin 13
// case rightMargin 14
// case topMargin 15
// case bottomMargin 16
// case leadingMargin 17
// case trailingMargin 18
// case centerXWithinMargins 19
// case centerYWithinMargins 20

const attributeNames = [
  'noAttribute',
  'left',
  'right',
  'top',
  'bottom',
  'leading',
  'trailing',
  'width',
  'height',
  'centerX',
  'centerY',
  'lastBaseline',
  'firstBaseline',
  'leftMargin',
  'rightMargin',
  'topMargin',
  'bottomMargin',
  'leadingMargin',
  'trailingMargin',
  'centerXWithinMargins',
  'centerYWithinMargins',
];

const relationSymbols = {
  '-1': '≤',
  '0': '=',
  '1': '≥',
};

const valueSwitch = {
  respectLanguageDirection: {
    1: '5',
    2: '6',
    5: '1',
    6: '2',
    13: '17',
    14: '18',
    17: '13',
    18: '14',
  },
  relativeToMargin: {
    1: '13',
    2: '14',
    3: '15',
    4: '16',
    5: '17',
    6: '18',
    9: '19',
    10: '20',
    13: '1',
    14: '2',
    15: '3',
    16: '4',
    17: '5',
    18: '6',
    19: '9',
    20: '10',
  },
};

const attributeToModifiers = {
  // attribute: [relativeToMargin, respectLanguageDirection]
  0: [undefined, undefined],
  1: [false, false],
  2: [false, false],
  3: [false, undefined],
  4: [false, undefined],
  5: [false, true],
  6: [false, true],
  7: [undefined, undefined],
  8: [undefined, undefined],
  9: [false, true],
  10: [false, undefined],
  11: [true, undefined],
  12: [true, undefined],
  13: [true, false],
  14: [true, false],
  15: [true, undefined],
  16: [true, undefined],
  17: [true, true],
  18: [true, true],
  19: [true, true],
  20: [true, undefined],
};

const constraintAttributes = [
  {
    label: 'Vertical Space',
    variants: [
      {
        options: [
          { label: 'Top with Margin', value: '15' },
          { label: 'Center Y within Margins', value: '20' },
          { label: 'First Baseline', value: '12' },
          { label: 'Last Baseline', value: '11' },
          { label: 'Bottom with Margin', value: '16' },
        ],
        relativeToMargin: true,
      },
      {
        options: [
          { label: 'Top', value: '3' },
          { label: 'Center Y', value: '10' },
          { label: 'First Baseline', value: '12' },
          { label: 'Last Baseline', value: '11' },
          { label: 'Bottom', value: '4' },
        ],
        relativeToMargin: false,
      },
    ],
    modifiers: [{ name: 'relativeToMargin', text: 'M' }],
  },
  {
    label: 'Horizontal Space',
    variants: [
      {
        options: [
          { label: 'Leading with Margin', value: '17' },
          { label: 'Center X within Margins', value: '19' },
          { label: 'Trailing with Margin', value: '18' },
        ],
        respectLanguageDirection: true,
        relativeToMargin: true,
      },
      {
        options: [
          { label: 'Leading', value: '5' },
          { label: 'Center X', value: '9' },
          { label: 'Trailing', value: '6' },
        ],
        respectLanguageDirection: true,
        relativeToMargin: false,
      },
      {
        options: [
          { label: 'Left with Margin', value: '13' },
          { label: 'Center X within Margins', value: '19' },
          { label: 'Right with Margin', value: '14' },
        ],
        respectLanguageDirection: false,
        relativeToMargin: true,
      },
      {
        options: [
          { label: 'Left', value: '1' },
          { label: 'Center X', value: '9' },
          { label: 'Right', value: '2' },
        ],
        respectLanguageDirection: false,
        relativeToMargin: false,
      },
    ],
    modifiers: [
      { name: 'relativeToMargin', text: 'M' },
      { name: 'respectLanguageDirection', text: 'L' },
    ],
  },
  {
    label: 'Size',
    variants: [
      {
        options: [
          { label: 'Width', value: '7' },
          { label: 'Height', value: '8' },
        ],
      },
    ],
  },
];

export {
  attributeNames,
  relationSymbols,
  valueSwitch,
  attributeToModifiers,
  constraintAttributes,
};
