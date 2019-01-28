// These allow using onClick without onKeyPress.
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import {EasyContext, Input} from 'context-easy';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {clearSelection, selectPage} from '../library';
import React, {useContext} from 'react';
import './pages.scss';

// Prevent form submit.
const handleSubmit = e => e.preventDefault();

export default () => {
  const context = useContext(EasyContext);
  const {pageName, pages, selectedPage} = context;
  const pageNames = Object.keys(pages).sort();

  const addPage = () => {
    // Add a new page.
    const newPage = {name: pageName};
    context.transform('pages', pages => ({
      ...pages,
      [pageName]: newPage
    }));

    selectPage(context, pageName);
    clearSelection(context);
    context.set('pageName', '');
  };

  const deletePage = pageName => {
    // Delete all the components on the current page.
    context.transform('instancePropsMap', instancePropsMap => {
      const ids = Object.keys(instancePropsMap);
      return ids.reduce((map, id) => {
        const properties = instancePropsMap[id];
        // Keep components not on the page being deleted.
        if (properties.page !== pageName) map[id] = properties;
        return map;
      }, {});
    });

    // Delete the page.
    context.delete('pages.' + pageName);
    clearSelection(context);
  };

  return (
    <div className="pages">
      <div className="new-page">
        <form onSubmit={handleSubmit}>
          <Input path="pageName" placeholder="Page Name" />
          <button className="add-btn" onClick={addPage}>
            <FontAwesomeIcon icon="plus" />
          </button>
        </form>
      </div>
      {pageNames.map((name, index) => (
        <div
          className={'page' + (name === selectedPage ? ' selected' : '')}
          key={'page' + index}
          onClick={() => selectPage(context, name)}
        >
          <span>{name}</span>
          <button className="delete-btn" onClick={() => deletePage(name)}>
            <FontAwesomeIcon icon="times" />
          </button>
        </div>
      ))}
    </div>
  );
};
