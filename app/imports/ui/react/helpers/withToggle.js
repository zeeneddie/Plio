import { branch } from 'recompose';
import { prop, identity } from 'ramda';
import withStateToggle from './withStateToggle';

const withToggle = (defaultValue = false) => branch(
  prop('toggle'),
  identity,
  withStateToggle(defaultValue, 'isOpen', 'toggle'),
);

export const WithToggle = withToggle()(({ children, ...props }) => children(props));

export default withToggle;
