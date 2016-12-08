import React, { PropTypes } from 'react';

import { createTypeItem } from '../../helpers';
import { TYPE_UNCATEGORIZED } from '../../constants';
import LHSItemContainer from '../../../containers/LHSItemContainer';
import StandardListContainer from '../../containers/StandardListContainer';
import LabelMessagesCount from '../../../components/Labels/LabelMessagesCount';
import SectionListContainer from '../../containers/SectionListContainer';

const TypeList = (props) => (
  <div>
    {props.types.map(type => (
      <LHSItemContainer
        key={type._id}
        item={createTypeItem(type._id)}
        lText={type.title}
        rText={type.unreadMessagesCount && (
          <LabelMessagesCount count={type.unreadMessagesCount} />
        )}
        hideRTextOnCollapse
        onToggleCollapse={props.onTypeToggleCollapse}
      >
        <div className="sub">
          {type._id === TYPE_UNCATEGORIZED ? (
            <StandardListContainer standards={type.standards} />
          ) : (
            <SectionListContainer
              standards={type.standards}
              onToggleCollapse={props.onSectionToggleCollapse}
            />
          )}
        </div>
      </LHSItemContainer>
    ))}
  </div>
);

TypeList.propTypes = {
  types: PropTypes.array.isRequired,
  onTypeToggleCollapse: PropTypes.func.isRequired,
  onSectionToggleCollapse: PropTypes.func.isRequired,
};

export default TypeList;
