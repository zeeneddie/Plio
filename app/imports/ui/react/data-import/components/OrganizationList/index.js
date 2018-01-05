import PropTypes from 'prop-types';
import React from 'react';

import Field from '../../../fields/read/components/Field';

const OrganizationList = ({ ownOrganizations, onOrgClick, documentType }) => {
  let content = null;

  if (ownOrganizations.length) {
    content = (
      <div>
        {ownOrganizations.map(({ _id, name, ...org }) => (
          <Field tag="button" key={_id} onClick={e => onOrgClick({ _id, name, ...org }, e)}>
            {name}
          </Field>
        ))}
      </div>
    );
  } else {
    content = (
      <Field>
        You need to be an owner of at least one organization to be able to import
        <span> {documentType} documents</span>
      </Field>
    );
  }

  return content;
};

OrganizationList.propTypes = {
  ownOrganizations: PropTypes.arrayOf(PropTypes.object),
  onOrgClick: PropTypes.func,
  documentType: PropTypes.string,
};

export default OrganizationList;
