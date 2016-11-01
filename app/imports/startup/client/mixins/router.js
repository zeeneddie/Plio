import { FlowRouter } from 'meteor/kadira:flow-router';
import invoke from 'lodash.invoke';

export default {
  goToDashboard(orgSerialNumber) {
    const params = { orgSerialNumber };
    FlowRouter.withReplaceState(() => {
      FlowRouter.go('dashboardPage', params);
    });
  },
  goToStandard(standardId, withQueryParams = true) {
    const params = { orgSerialNumber: this.organizationSerialNumber(), standardId };
    const queryParams = !!withQueryParams ? { filter: this.activeStandardFilterId() } : {};
    FlowRouter.withReplaceState(() => {
      FlowRouter.go('standard', params, queryParams);
    });
  },
  goToNC(nonconformityId, withQueryParams = true) {
    const params = { orgSerialNumber: this.organizationSerialNumber(), nonconformityId };
    const queryParams = !!withQueryParams ? { filter: this.activeNCFilterId() } : {};
    FlowRouter.withReplaceState(() => {
      FlowRouter.go('nonconformity', params, queryParams);
    });
  },
  goToNCs(withQueryParams = true) {
    const params = { orgSerialNumber: this.organizationSerialNumber() };
    const queryParams = !!withQueryParams ? { filter: this.activeNCFilterId() } : {};
    FlowRouter.withReplaceState(() => {
      FlowRouter.go('nonconformities', params, queryParams);
    });
  },
  goToWorkItem(workItemId, queryParams = { filter: this.activeWorkInboxFilterId() }) {
    const params = { workItemId, orgSerialNumber: this.organizationSerialNumber() };
    FlowRouter.withReplaceState(() => {
      FlowRouter.go('workInboxItem', params, queryParams);
    });
  },
  goToWorkInbox(withQueryParams = true) {
    const params = { orgSerialNumber: this.organizationSerialNumber() };
    const queryParams = !!withQueryParams ? { filter: this.activeWorkInboxFilterId() } : {};
    FlowRouter.withReplaceState(() => {
      FlowRouter.go('workInbox', params, queryParams);
    });
  },
  goToDefaultWorkItem(
    list = 'WorkInbox_List',
    getRouteOptions = '_findWorkItemForFilter',
    redirectHandler = 'goToWorkItem'
  ) {
    return redirectToDefaultDocument.call(this, list, getRouteOptions, redirectHandler);
  },
  goToRisk(riskId, withQueryParams = true) {
    const params = { riskId, orgSerialNumber: this.organizationSerialNumber() };
    const queryParams = !!withQueryParams ? { filter: this.activeRiskFilterId() } : {};
    FlowRouter.withReplaceState(() => {
      FlowRouter.go('risk', params, queryParams);
    });
  },
  goToRisks(withQueryParams = true) {
    const params = { orgSerialNumber: this.organizationSerialNumber() };
    const queryParams = !!withQueryParams ? { filter: this.activeRiskFilterId() } : {};
    FlowRouter.withReplaceState(() => {
      FlowRouter.go('risks', params, queryParams);
    });
  },
  handleRouteRedirect(vmName) {
    return Meteor.defer(() => invoke(ViewModel.findOne(vmName), 'handleRoute'));
  },
  handleRouteRisks() {
    return this.handleRouteRedirect('Risks_List');
  },
  handleRouteWorkInbox() {
    return this.handleRouteRedirect('WorkInbox_List');
  },
  handleRouteNCs() {
    return this.handleRouteRedirect('NC_List');
  },
  handleRouteStandards() {
    return this.handleRouteRedirect('StandardsList');
  }
};