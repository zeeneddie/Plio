/* eslint-disable new-cap */

import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { Meteor } from 'meteor/meteor';
import { ViewModel } from 'meteor/manuel:viewmodel';
import invoke from 'lodash.invoke';

import { NonConformityFilters } from '/imports/api/constants';
import { isMobileRes } from '../../../../api/checkers';
import HeaderMenu from '../../../../client/react/noncomformities/components/HeaderMenu';

Template.NC_Header.viewmodel({
  mixin: ['nonconformity', 'organization', 'router'],
  headerArgs() {
    return {
      idToExpand: this.NCId(),
      filters: NonConformityFilters,
      onSelectFilter: this.onSelectFilter.bind(this),
      isActiveFilter: this.isActiveNCFilter.bind(this),
      transformHeader: () => 'NCs & PGs - ',
      getOptionsMenu() {
        return {
          component: HeaderMenu,
        };
      },
    };
  },
  NC() {
    return this._getNCByQuery({ _id: this.NCId() });
  },
  onSelectFilter(value, onSelect) {
    onSelect();

    Tracker.afterFlush(() => {
      Meteor.defer(() => {
        const list = Object.assign({}, ViewModel.findOne('NC_List'));

        return !!list && invoke(list, 'handleRoute');
      });
    });
  },
  onNavigate() {
    const mobileWidth = isMobileRes();
    const goToDashboard = () => this.goToDashboard(this.organizationSerialNumber());

    if (mobileWidth) {
      this.width(mobileWidth);
      return this.goToNC(this.NCId());
    }

    return goToDashboard();
  },
});
