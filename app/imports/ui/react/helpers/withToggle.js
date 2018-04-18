import { branch } from 'recompose';
import { prop, identity } from 'ramda';
import withStateToggle from './withStateToggle';

export default (defaultValue = false) => branch(
  prop('toggle'),
  identity,
  withStateToggle(defaultValue, 'isOpen', 'toggle'),
);
