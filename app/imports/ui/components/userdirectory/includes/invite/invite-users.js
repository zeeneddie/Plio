import { Template } from 'meteor/templating';
import { ViewModel } from 'meteor/manuel:viewmodel';
import { inviteMultipleUsersByEmail } from '/imports/api/organizations/methods'

Template.UserDirectory_InviteUsers.viewmodel({
  mixin: 'modal',
  welcomeMessage: 'Hi there.\nWe\'ll be using Plio to share compliance standards documents, to record non-conformities and risks and to track actions. See you soon.',
  usersEntries: _.range(0, 4).map((i) => {
    return {avatarIndex: i};
  }),

  save() {
    let emailViewModels = this.children('UserDirectory_InviteUsers_UserEntry');
    let emails = emailViewModels
      .map(userEntryViewModel => userEntryViewModel.email()) // get emails
      .filter(email => !!email); // get rid of empty strings

    if(emails.length <= 0) {
      this.modal().setError('You need to fill in at least one valid email address first');
      return;
    }

    let welcomeMessage = this.welcomeMessage();
    let organizationId = this.organizationId();

    if (emails.length > 0) {
      this.modal().callMethod(inviteMultipleUsersByEmail, {
        organizationId, emails, welcomeMessage
      }, (err, res) => {
        if (!err) {
          const invitedEmails = res.invitedEmails;
          const successMessagePart = invitedEmails.length > 0 ? `Invite${invitedEmails.length > 1 ? 's' : ''} to "${invitedEmails.join(', ')}" ${invitedEmails.length > 1 ? 'were' : 'was'} sent successfully.` : '';
          const failMessagePart = res.error ? `\n${res.error}` : '';

          let notificationTitle;
          if (failMessagePart) {
            if (successMessagePart) {
              notificationTitle = 'Some users were not invited!';
            } else {
              notificationTitle = 'Not invited!'
            }
          } else {
            notificationTitle = 'Invited!'
          }

          const expirationMessagePart = `\nExpiration date: ${moment().add(res.expirationTime, 'days').format('MMMM Do YYYY')}`;
          swal(notificationTitle, `${successMessagePart}${failMessagePart}${expirationMessagePart}`,
            failMessagePart ? 'error' : 'success');
          this.modal().close();
        }
      });
    }
  }
});
