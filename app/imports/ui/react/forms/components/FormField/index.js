import PropTypes from 'prop-types';
import React from 'react';

import FormLabel from '../../../components/Labels/FormLabel';
import HelpPanel from '../../../components/HelpPanel';
import withStateCollapsed from '../../../helpers/withStateCollapsed';

const FormField = ({
  colXs = 12,
  colSm = 8,
  helpText,
  collapsed = true,
  onToggleCollapse,
  children,
}) => (
  <div className="form-group row">
    <FormLabel
      {...{
        colXs, collapsed, onToggleCollapse, helpText,
      }}
      colSm={12 - parseInt(colSm, 10)}
    >
      {children[0]}
    </FormLabel>
    <div className={`col-xs-${colXs} col-sm-${colSm}`}>
      {children[1]}

      {helpText && (
        <HelpPanel.Body {...{ collapsed, onToggleCollapse }}>
          {helpText}
        </HelpPanel.Body>
      )}
    </div>
  </div>
);

FormField.propTypes = {
  colXs: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  colSm: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  helpText: PropTypes.string,
  collapsed: PropTypes.bool,
  onToggleCollapse: PropTypes.func,
  children: PropTypes.node,
};

export default withStateCollapsed(({ collapsed = true } = {}) => collapsed)(FormField);
