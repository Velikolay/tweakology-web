import React from 'react';

import {
  ContentModeOptions,
  SemanticContentAttributeOptions,
} from '../../../../../../services/device/metadata/UIView';

import Frame from '../../Blocks/Frame';
import InputField from '../../Blocks/InputField';
import SelectField from '../../Blocks/SelectField';
import Color from '../../Blocks/Color/Color';

const UIImageViewAttributes = () => (
  <React.Fragment>
    <Frame prefix="frame" />
    <hr />
    <InputField
      name="image.src"
      type="text"
      title="Image"
      placeholder="Image name or url"
    />
    <InputField
      name="highlightedImage.src"
      type="text"
      title="Highlighted"
      placeholder="Image name or url"
    />
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

export default UIImageViewAttributes;
