import React from 'react';

const defaults = {
  classNames: {
    lhs: 'content-list scroll',
    rhs: 'content-cards hidden-sm-down scroll'
  },

  styles: {
    lhs: null,
    rhs: {
      display: 'block !important'
    }
  }
};

const Page = ({
  classNames = defaults.classNames,
  styles = defaults.styles,
  children
}) => (
  <div className="row">
    <div className={classNames.lhs} style={styles.lhs}>
      {children[0]}
    </div>
    <div className={classNames.rhs} style={styles.rhs}>
      {children[1]}
    </div>
  </div>
);

export default Page;
