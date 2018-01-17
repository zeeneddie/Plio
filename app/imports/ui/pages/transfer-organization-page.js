import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Organizations } from '/imports/share/collections/organizations';
import { transferOrganization } from '/imports/api/organizations/methods';
import { client } from '../../client/apollo';

Template.TransferOrganizationPage.viewmodel({
  mixin: ['router'],
  transferId: '',
  orgName: '',
  orgSerialNumber: '',
  isTransfered: false,
  error: '',
  onCreated(template) {
    template.autorun(() => {
      this.isTransfered(false);

      const transferId = FlowRouter.getParam('transferId');
      this.transferId(transferId);

      template.subscribe('transferredOrganization', transferId, {
        onReady: () => {
          const organization = Organizations.findOne({
            'transfer._id': transferId,
            'transfer.newOwnerId': Meteor.userId(),
          });

          if (!organization) {
            return;
          }
          const { name, serialNumber } = organization;
          this.orgName(name);
          this.orgSerialNumber(serialNumber);


          transferOrganization.call({ transferId }, (err) => {
            if (err) {
              this.error(err.reason);
            } else {
              this.isTransfered(true);
            }
          });
        },
        onError: (err) => {
          this.error(err.reason);
          if (err.error === 403) {
            Meteor.logout(() => {
              client.resetStore(); // reset apollo client store on logout
            });
          }
        },
      });
    });
  },
});
