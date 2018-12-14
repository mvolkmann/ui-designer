import {EasyContext, Select} from 'context-easy';
import React, {useCallback, useContext} from 'react';

import Clock from '../clock/clock';
import Date from '../date/date';
import ToggleButtons from '../toggle-buttons/toggle-buttons';

import './ui-designer.scss';

const buttons = [{text: 'Edit'}, {text: 'Test'}];

let componentId = 0;

function getComponent(name) {
  componentId++;
  const key = 'c' + componentId;
  switch (name) {
    case 'Clock':
      return <Clock key={key} />;
    case 'Date':
      return <Date key={key} />;
    default:
  }
}

export default () => {
  const context = useContext(EasyContext);
  const {components, selectedComponent} = context;

  const addComponent = useCallback(() => {
    console.log(
      'ui-designer.js addComponent: selectedComponent =',
      selectedComponent
    );
    const component = getComponent(selectedComponent);
    context.push('components', component);
  });

  return (
    <div className="ui-designer">
      <header>
        <h2>UI Designer</h2>
        <div>
          <label>Mode</label>
          <ToggleButtons buttons={buttons} />
        </div>
      </header>
      <section className="component-select">
        <Select path="selectedComponent">
          <option value="" />
          <option value="Clock">Clock</option>
          <option value="Date">Date</option>
        </Select>
        <button disabled={!selectedComponent} onClick={addComponent}>
          Add
        </button>
      </section>
      <section className="component-display">{components}</section>
      <footer />
    </div>
  );
};
