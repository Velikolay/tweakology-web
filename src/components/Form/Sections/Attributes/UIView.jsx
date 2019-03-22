import React from 'react';

import {
  ContentModeOptions,
  SemanticContentAttributeOptions,
} from '../../../../services/device/metadata/UIView';

import Frame from '../../Blocks/Frame';
import SelectField from '../../Blocks/SelectField';
import Color from '../../Blocks/Color/Color';

const UIViewAttributes = () => (
  <React.Fragment>
    <Frame prefix="frame" />
    <hr />
    <SelectField
      name="contentMode"
      options={ContentModeOptions}
      title="Content Mode"
    />
    <SelectField
      name="semanticContentAttribute"
      options={SemanticContentAttributeOptions}
      title="Semantic"
    />
    <hr />
    <Color
      prefix="backgroundColor"
      titles={{ alpha: 'Alpha', color: 'Background' }}
    />
  </React.Fragment>
);

export default UIViewAttributes;
