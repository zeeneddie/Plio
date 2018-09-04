import withStateToggle from './withStateToggle';

export default (initial, prop = 'collapsed', handle = 'onToggleCollapse') =>
  withStateToggle(initial, prop, handle);
