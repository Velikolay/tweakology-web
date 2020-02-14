// @flow

import React, { useState } from 'react';

import { Editor, EditorState, RichUtils, convertFromRaw } from 'draft-js';
import Prism from 'prismjs';
import PrismDecorator from 'draft-js-prism';
import './LiquidCodeHighlight';

import { deepValue } from '../Formik';

type LiquidCodeEditorControlledProps = {
  name: string,
  formik: {
    setFieldValue: (string, { value: string, label: string }) => void,
    values: any,
  },
};

const LiquidCodeEditorControlled = (props: LiquidCodeEditorControlledProps) => {
  const {
    name,
    formik: { setFieldValue, values },
  } = props;

  // $FlowFixMe draft-js convertFromRaw bug!
  const contentState = convertFromRaw({
    entityMap: {},
    blocks: [
      {
        type: 'code-block',
        text:
          deepValue(values, name) ||
          '{% comment %}Insert Liquid Expression{% endcomment %}',
      },
    ],
  });

  const decorator = new PrismDecorator({
    prism: Prism,
    defaultSyntax: 'liquid',
  });

  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(contentState, decorator),
  );

  const onChange = es => {
    setFieldValue(name, es.getCurrentContent().getFirstBlock().text);
    setEditorState(es);
  };

  const handleKeyCommand = command => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      onChange(newState);
      return true;
    }
    return false;
  };

  const handleReturn = (e, es) => {
    const newState = RichUtils.insertSoftNewline(es);
    if (newState) {
      onChange(newState);
      return true;
    }
    return false;
  };

  const liquidStyleFn = contentBlock => {
    const type = contentBlock.getType();
    if (type === 'code-block') {
      return 'language-liquid';
    }
    return '';
  };

  return (
    <Editor
      blockStyleFn={liquidStyleFn}
      editorState={editorState}
      handleKeyCommand={handleKeyCommand}
      handleReturn={handleReturn}
      onChange={onChange}
    />
  );
};

export default LiquidCodeEditorControlled;
