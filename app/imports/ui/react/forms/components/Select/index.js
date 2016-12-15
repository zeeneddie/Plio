import React, { PropTypes } from 'react';
import { _ } from 'meteor/underscore';
import { compose, getContext, mapProps } from 'recompose';
import cx from 'classnames';
import Blaze from 'meteor/blaze-react-component';

const enhance = compose(
  mapProps(props => ({
    ...props,
    items: _.contains(props.items, props.selected)
      ? props.items
      : [...props.items, props.selected],
  })),
  getContext({ changeField: PropTypes.func }),
);
const Select = enhance(({ items, name, changeField, colSm, colXs, ...other }) => (
  <div className={cx(colSm && `col-sm-${colSm}`, colXs && `col-xs-${colXs}`)}>
    <Blaze
      template="Select_Single"
      content="CustomTitleCreate"
      onUpdate={vm => changeField(name, vm.value())}
      items={items.map(item => ({ _id: item, title: item }))}
      {...other}
    />
  </div>
));

Select.propTypes = {
  items: PropTypes.array.isRequired,
  selected: PropTypes.string,
  colSm: PropTypes.number,
  colXs: PropTypes.number,
};

export default Select;
