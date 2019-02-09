/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import {EasyContext} from 'context-easy';
import React, {useContext} from 'react';
import {Responsive as ResponsiveGridLayout} from 'react-grid-layout';

import '../components';
import {
  getComponent,
  getConfig,
  getProperties,
  toggleSelected
} from '../library';
import ComponentSelect from '../component-select/component-select';
import Pages from '../pages/pages';
import PropEditor from '../prop-editor/prop-editor';
import ToggleButtons from '../toggle-buttons/toggle-buttons';

import './ui-designer.scss';

const MODES = [{label: 'Edit'}, {label: 'Demo'}];

export default function UiDesigner() {
  const context = useContext(EasyContext);
  const {
    classPropsMap,
    instancePropsMap,
    mode,
    selectedComponentId,
    selectedPage
  } = context;

  const isEdit = mode === 'Edit';
  const selectedComponent = instancePropsMap[selectedComponentId];
  const config = selectedComponent
    ? getConfig(selectedComponent.componentName)
    : {};

  const getComponents = instancePropsMap => {
    // Get an array of component ids on the selected page.
    const componentIds = Object.keys(instancePropsMap).filter(
      id => instancePropsMap[id].onPage === selectedPage
    );

    return componentIds.map((componentId, index) => {
      const instanceProps = instancePropsMap[componentId];
      const classProps = classPropsMap[instanceProps.componentName];
      const properties = getProperties(classProps, instanceProps);
      const component = getComponent(properties);

      const className =
        'container' +
        (instanceProps.selected ? ' selected ' : ' ') +
        properties.class;
      const dataGrid = {
        i: componentId,
        x: 0,
        y: 0,
        w: properties.defaultCellWidth,
        h: properties.defaultCellHeight
      };
      return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
        <div
          className={className}
          data-grid={dataGrid}
          key={componentId}
          onClick={() => toggleSelected(context, componentId)}
        >
          {component}
        </div>
      );
    });
  };

  const layoutKey = `ui-designer/${selectedPage}/layout`;

  function getLayout(page) {
    const json = sessionStorage.getItem(layoutKey);
    return json ? JSON.parse(json) : [];
  }

  function saveLayout(layout) {
    // Don't save the layout if we are changing the current page.
    // react-grid-layout really shouldn't
    // trigger onLayoutChange when this happens!
    if (sessionStorage.getItem('page-changed')) {
      sessionStorage.removeItem('page-changed');
      return;
    }

    sessionStorage.setItem(layoutKey, JSON.stringify(layout));
  }

  const layout = getLayout(selectedPage);
  const layouts = {lg: layout};

  return (
    <div className="ui-designer">
      <header>
        <img alt="logo" className="logo" src="logo.png" />
        <ToggleButtons buttons={MODES} path="mode" />
      </header>
      <section className="main">
        {isEdit && <Pages />}
        <div className="middle">
          {isEdit && <ComponentSelect />}
          <ResponsiveGridLayout
            autoSize={false}
            breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
            className={'layout component-display' + (isEdit ? ' edit' : '')}
            cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}
            isDraggable={isEdit}
            isResizable={isEdit}
            layouts={layouts}
            onLayoutChange={saveLayout}
            rowHeight={41}
            width={1000}
          >
            {getComponents(instancePropsMap)}
          </ResponsiveGridLayout>
        </div>
        {isEdit && selectedComponentId ? <PropEditor config={config} /> : null}
      </section>
      <footer />
    </div>
  );
}
