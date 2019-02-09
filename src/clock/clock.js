import {bool} from 'prop-types';
import React, {useEffect, useState} from 'react';
import {register} from '../library';
import {getStyles} from '../styles';
import './clock.scss';

function padNumber(n) {
  return n.toString().padStart(2, '0');
}

const config = {
  backgroundColor: {
    type: 'color',
    defaultValue: '#ffffff'
  },
  color: {
    type: 'color',
    defaultValue: '#0000ff'
  },
  fontFamily: {
    type: 'fontFamily',
    defaultValue: 'sans-serif'
  },
  fontSize: {
    type: 'fontSize',
    defaultValue: 18
  },
  hours24: {
    type: 'boolean',
    defaultValue: false
  },
  showSeconds: {
    type: 'boolean',
    defaultValue: true
  }
};

function Clock(props) {
  const [, refresh] = useState();

  useEffect(() => {
    const token = setInterval(refresh, 1000);
    return () => clearInterval(token);
  }, []);

  const date = new Date();
  let hours = date.getHours();
  const amPm = hours >= 12 ? 'PM' : 'AM';
  if (!props.hours24) hours %= 12;
  const minutes = padNumber(date.getMinutes());
  let time = hours + ':' + minutes;

  if (props.showSeconds) time += ':' + padNumber(date.getSeconds());

  time += ' ' + amPm;

  return (
    <div className="clock" style={getStyles(props)}>
      {time}
    </div>
  );
}

Clock.propTypes = {
  hours24: bool,
  showSeconds: bool
};

register(Clock, config, 2, 1);
