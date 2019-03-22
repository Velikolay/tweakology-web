import React from 'react';

import {
  ContentModeOptions,
  SemanticContentAttributeOptions,
} from '../../../../services/device/metadata/UIView';

import Frame from '../../Blocks/Frame';
import InputField from '../../Blocks/InputField';
import SelectField from '../../Blocks/SelectField';
import Font from '../../Blocks/Font';
import Color from '../../Blocks/Color/Color';

const UIButtonAttributes = () => (
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
    <hr />
    <InputField name="title.text" type="text" title="Title" />
    <Font prefix="title.font" />
    <Color
      prefix="title.textColor"
      titles={{ alpha: 'Opacity', color: 'Text Color' }}
    />
  </React.Fragment>
);

export default UIButtonAttributes;
