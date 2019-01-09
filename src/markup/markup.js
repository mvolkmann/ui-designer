import {EasyContext} from 'context-easy';
import marked from 'marked';
import {string} from 'prop-types';
import React, {useContext} from 'react';

import {register} from '../library';
import {getStyles} from '../styles';

import './markup.scss';

const config = {
  backgroundColor: {
    type: 'color',
    defaultValue: '#FFFFFF'
  },
  color: {
    type: 'color',
    defaultValue: '#0000FF'
  },
  fontFamily: {
    type: 'fontFamily',
    defaultValue: 'sans-serif'
  },
  fontSize: {
    type: 'fontSize',
    defaultValue: 18
  },
  height: {
    type: 'number',
    defaultValue: 100
  },
  markup: {
    type: 'textarea',
    defaultValue: ''
  },
  width: {
    type: 'number',
    defaultValue: 200
  }
};

function Markup(props) {
  const {markup} = props;
  const context = useContext(EasyContext);

  // Replace placeholders in markup with context values.
  const re = /\$\{([^}]+)\}/;
  const parts = markup
    .split(re)
    .map((part, index) => (index % 2 === 0 ? part : context.get(part)));
  const text = parts.join('');

  return (
    <div
      className="markup"
      dangerouslySetInnerHTML={{__html: marked(text)}}
      style={getStyles(props)}
    />
  );
}

Markup.propTypes = {
  markup: string.isRequired
};

register(Markup, config);
