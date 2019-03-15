import React from 'react';

import {
  ContentModeOptions,
  SemanticContentAttributeOptions,
} from '../../../../../Static/UIView';
import {
  LineBreakModeOptions,
  BaselineOptions,
} from '../../../../../Static/UILabel';

import Frame from '../../../Blocks/Frame/Frame';
import InputField from '../../../Blocks/InputField/InputField';
import SelectField from '../../../Blocks/SelectField/SelectField';
import TextAlignment from '../../../Blocks/TextAlignment/TextAlignment';
import Font from '../../../Blocks/Font/Font';
import Color from '../../../Blocks/Color/Color';

const UILabelViewAttributesPresenter = () => (
  <React.Fragment>
    <Frame prefix="frame" />
    <hr />
    <InputField name="text" type="text" title="Text" />
    <TextAlignment />
    <InputField name="numberOfLines" type="number" min={0} title="Lines" />
    <Font prefix="font" />
    <Color
      prefix="textColor"
      titles={{ alpha: 'Opacity', color: 'Text Color' }}
    />
    <hr />
    <SelectField
      name="baselineAdjustment"
      options={BaselineOptions}
      title="Baseline"
    />
    <SelectField
      name="lineBreakMode"
      options={LineBreakModeOptions}
      title="Line Break"
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

export default UILabelViewAttributesPresenter;
