import React from 'react';
import cx from 'classnames';

import propTypes from './propTypes';
import { ProblemsStatuses } from '/imports/share/constants';
import { getUserFullNameOrEmail } from '/imports/share/helpers';
import createReadFields from '../../../../helpers/createReadFields';
import DepartmentsContainer from '../../../../fields/read/containers/DepartmentsContainer';
import Source from '../../../../fields/read/components/Source';
import Notify from '../../../../fields/read/components/Notify';
import ImprovementPlan from '../../../../fields/read/components/ImprovementPlan';
import FileProvider from '../../../../containers/providers/FileProvider';
import ConnectedDocListContainer from '../../../fields/read/containers/ConnectedDocListContainer';

const BodyContents = (props => {
  console.log(props);
  const { title, sequentialId, status, description } = props.risk;

  return (
    <div>
      <div className="list-group">
        <div className="list-group-item">
          <p className="list-group-item-text">Risk name</p>
          <h4 className="list-group-item-heading">
            <span>{title}</span>
            <span className="label margin-left label-warning">{sequentialId}</span>
            <span className="label text-default">{ProblemsStatuses[status]}</span>
          </h4>
        </div>

        <div className="list-group-item">
          <p className="list-group-item-text">Description</p>
          <h4 className="list-group-item-heading">
            <span>{description}</span>
          </h4>
        </div>
      </div>

      {/*{notify ? (<Notify users={[...notify]} />) : null}*/}

      {/*<ConnectedDocListContainer riskId={_id}>*/}
        {/*{improvementPlan && (*/}
          {/*<ImprovementPlan*/}
            {/*label="Improvement Plan"*/}
            {/*{...improvementPlan}*/}
          {/*/>*/}
        {/*)}*/}
      {/*</ConnectedDocListContainer>*/}
    </div>
  );
});

BodyContents.propTypes = propTypes;

export default BodyContents;
