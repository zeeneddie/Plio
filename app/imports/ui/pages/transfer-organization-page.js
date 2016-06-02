import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Organizations } from '/imports/api/organizations/organizations.js';
import { transferOrganization } from '/imports/api/organizations/methods.js';

import Utils from '/imports/core/utils';


Template.TransferOrganizationPage.viewmodel({
  mixin: ['router'],
  transferId: '',
  organizationId: '',
  isTransfered: false,
  isTransferPerfomed: false,
  isNoOrganization: true,
  isReady: false,
  onCreated(template) {
    template.autorun(() => {
      this.isReady(false);

      let transferId = FlowRouter.getParam('transferId');
      this.transferId(transferId);

      template.subscribe('transferredOrganization', transferId, {
        onReady: () => {
          const organization = Organizations.findOne({
            'transfer._id': transferId,
            'transfer.newOwnerId': Meteor.userId()
          });

          if (!organization) {
            this.isReady(true);
            return;
          } else {
            this.organizationId(organization._id);
          }

          transferOrganization.call({ transferId }, (err) => {
            this.isReady(true);

            if (err) {
              Utils.showError(err.reason);
            } else {
              this.isTransfered(true);
            }
          });
        }
      });
    });
  },
  organization() {
    return Organizations.findOne({
      _id: this.organizationId()
    });
  },
  organizationName() {
    return this.organization().name;
  },
  showLoader() {
    return !this.templateInstance.subscriptionsReady() && !this.isReady();
  }
});
