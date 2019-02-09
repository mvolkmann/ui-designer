import {EasyContext, Input, Select} from 'context-easy';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React, {useContext} from 'react';

import {getComponentNames, selectPage, toggleSelected} from '../library';

import './component-select.scss';

export default function ComponentSelect() {
  const context = useContext(EasyContext);
  const {
    editingPageName,
    instancePropsMap,
    lastComponentId,
    pages,
    selectedComponentName,
    selectedPage
  } = context;

  const addComponent = () => {
    const componentId = 'c' + (lastComponentId + 1);
    context.increment('lastComponentId');

    const properties = {
      componentId,
      componentName: selectedComponentName,
      hAlign: 'flex-start',
      vAlign: 'flex-start',
      onPage: selectedPage
    };

    const newPropsMap = {...instancePropsMap, [componentId]: properties};
    context.set('instancePropsMap', newPropsMap);
    toggleSelected(context, componentId);
  };

  const editPageName = () => {
    context.toggle('editingPageName');
    context.set('newPageName', selectedPage);
  };

  const savePageName = event => {
    if (event.key !== 'Enter') return;

    const newPage = event.target.value;
    if (pages[newPage]) {
      console.error('ui-designer.js savePageName: already exists');
    } else {
      context.set('pages.' + newPage, pages[selectedPage]);
      context.delete('pages.' + selectedPage);
      selectPage(context, newPage);
    }

    context.set('editingPageName', false);
  };

  const componentNames = getComponentNames();

  return (
    <section className="component-select">
      <div className="page-area">
        <div className="page">
          {editingPageName ? (
            <Input
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              path="newPageName"
              onBlur={savePageName}
              onKeyPress={savePageName}
            />
          ) : (
            <>
              <span>{selectedPage}</span>
              <button className="edit-page-name" onClick={editPageName}>
                <FontAwesomeIcon icon="pen" />
              </button>
            </>
          )}
        </div>
      </div>
      <div className="selector">
        <Select path="selectedComponentName">
          <option value="" />
          {componentNames.map((name, index) => (
            <option key={'option' + index}>{name}</option>
          ))}
        </Select>
        <button
          disabled={!selectedPage || !selectedComponentName}
          onClick={addComponent}
        >
          Add
        </button>
      </div>
    </section>
  );
}
