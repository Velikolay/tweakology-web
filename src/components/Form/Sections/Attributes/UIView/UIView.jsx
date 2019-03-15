import React from 'react';

import {
  ContentModeOptions,
  SemanticContentAttributeOptions,
} from '../../../../../Static/UIView';

import Frame from '../../../Blocks/Frame/Frame';
import SelectField from '../../../Blocks/SelectField/SelectField';
import Color from '../../../Blocks/Color/Color';

const UIViewAttributesPresenter = () => (
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

export default UIViewAttributesPresenter;
