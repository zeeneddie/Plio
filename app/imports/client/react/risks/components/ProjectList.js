import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

import { CollectionNames } from '../../../../share/constants';
import createTypeItem from '../../helpers/createTypeItem';
import LHSItemContainer from '../../containers/LHSItemContainer';
import RisksListContainer from '../containers/RisksListContainer';
import LabelMessagesCount from '../../components/Labels/LabelMessagesCount';

const TypeList = ({ projects, onToggleCollapse }) => (
  <div>
    {projects.map(project => (
      <LHSItemContainer
        key={project._id}
        item={createTypeItem(CollectionNames.PROJECTS, project._id)}
        lText={cx(project.title)}
        rText={project.unreadMessagesCount && (
          <LabelMessagesCount count={project.unreadMessagesCount} />
        )}
        hideRTextOnCollapse
        onToggleCollapse={onToggleCollapse}
        count={project.risks.length}
      >
        <div className="sub">
          <RisksListContainer risks={project.risks} />
        </div>
      </LHSItemContainer>
    ))}
  </div>
);

TypeList.propTypes = {
  projects: PropTypes.array.isRequired,
  onToggleCollapse: PropTypes.func.isRequired,
};

export default TypeList;
