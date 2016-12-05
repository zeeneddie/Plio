import React, { PropTypes } from 'react';
import { compose, withState, setDisplayName } from 'recompose';
import TextInput from '../TextInput';
import Dropdown from '/imports/ui/react/components/Dropdown';

const enhance = compose(
  setDisplayName('Select'),
  withState('selectedItem', 'setSelectedItem', 0)
);

const Select = enhance((props) => (
  <div className="form-group row">
    <label className="form-control-label col-sm-4 col-xs-12">
      {props.label}
    </label>
    <div className="col-sm-4 col-xs-12">
      <Dropdown
        className="input-group-typeahead form-group-flex-flex"
        onChange={props.setSelectedItem}
        activeItemIndex={props.selectedItem}
      >
        <Dropdown.Title as="div" className="input-group">
          <TextInput value="@value" className="form-control" />
          <span className="input-group-btn">
            <button type="button" className="btn btn-secondary btn-icon">
              <i className="fa fa-caret-down" />
            </button>
          </span>
        </Dropdown.Title>
        <Dropdown.Menu className="input-group">
          {props.items.map((item, index) => (
            <Dropdown.Item
              pointer
              key={`dropdown-item-${index}`}
              value={item}
            >
              {item}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
        {props.isEnhanceable ? (
          <div>
            <div className="dropdown-divider"></div>
            <a className="dropdown-item pointer">
              <strong>Some text</strong>
            </a>
          </div>
        ) : null}
      </Dropdown>
    </div>
  </div>
));

Select.propTypes = {
  onChange: PropTypes.func,
  setSelectedItem: PropTypes.func,
  label: PropTypes.string,
  items: PropTypes.array.isRequired,
  selectedItem: PropTypes.number,
  isEnhanceable: PropTypes.bool,
};

export default Select;
