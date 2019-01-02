import {EasyContext} from 'context-easy';
import {arrayOf, shape, string} from 'prop-types';
import React, {useContext} from 'react';
import './toggle-button.scss';

function ToggleButtons({buttons, path}) {
  const context = useContext(EasyContext);
  return (
    <div className="toggle-buttons">
      {buttons.map((button, index) => {
        const {label, value} = button;
        const v = value || label;
        return (
          <button
            className={v === context[path] ? 'selected' : ''}
            key={'b' + index}
            onClick={() => context.set(path, v)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

ToggleButtons.propTypes = {
  buttons: arrayOf(shape({label: string.isRequired, value: string})).isRequired,
  path: string.isRequired
};

export default ToggleButtons;
