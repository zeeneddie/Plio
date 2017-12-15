import React from 'react';
import { compose, mapProps } from 'recompose';
import { connect } from 'react-redux';
import property from 'lodash.property';
import { propEq } from 'ramda';

import StatusList from '../../components/StatusList';
import {
  handleRisksRedirectAndOpen,
  createRiskStatusItem,
  withRisksRedirectAndOpen,
} from '../../helpers';
import { problemsStatuses } from '../../../problems/constants';
import { getClassByStatus } from '../../../../../api/problems/helpers';
import Icon from '../../../components/Icons/Icon';
import { Pull } from '../../../components/Utility';
import { getSelectedRiskIsDeleted } from '../../../../../client/store/selectors/risks';

const mapStateToProps = state => ({
  isSelectedRiskDeleted: getSelectedRiskIsDeleted(state),
});

const redirectAndOpen = ({ statuses, risksByIds, ...props }) => handleRisksRedirectAndOpen(
  compose(createRiskStatusItem, property('value')),
  statuses,
  risksByIds,
  props,
);

export default compose(
  connect(mapStateToProps),
  mapProps(({ risks = [], ...props }) => {
    // add own risks to each status
    const reducer = (prev, status) => {
      const ownRisks = risks.filter(propEq('status', status.value));

      if (ownRisks.length) {
        const indicatorCx = `text-${getClassByStatus(status.value)}`;
        const indicator = (
          <Pull right>
            <Icon name="circle" margin="right" className={indicatorCx} />
          </Pull>
        );

        return prev.concat({ ...status, risks: ownRisks, indicator });
      }

      return prev;
    };

    const statuses = problemsStatuses.reduce(reducer, []);

    return { ...props, statuses };
  }),
  withRisksRedirectAndOpen(redirectAndOpen),
)(StatusList);
