/* eslint-disable function-paren-newline */

import { setDisplayName, wrapDisplayName, compose } from 'recompose';

const namedCompose = wrapperName => (...hocs) => BaseComponent =>
  setDisplayName(
    wrapDisplayName(BaseComponent, wrapperName),
  )(
    compose(...hocs)(BaseComponent),
  );

export default namedCompose;
