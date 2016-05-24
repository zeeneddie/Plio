import { Template } from 'meteor/templating';
import { ViewModel } from 'meteor/manuel:viewmodel';
import { inviteMultipleUsersByEmail } from '/imports/api/organizations/methods'

Template.UserDirectory_InviteUsers.viewmodel({
  mixin: 'modal',
  welcomeMessage: 'Hi there.\nWe\'ll be using Plio to store documents, complete worksheets and track issues during this project.',
  usersEntries: _.range(1, 5).map((i) => {
    return {avatarIndex: i};
  }),

  save() {
    let emailViewModels = this.children('UserDirectory_InviteUsers_UserEntry');
    let emails = emailViewModels
      .map(userEntryViewModel => userEntryViewModel.email()) // get emails
      .filter(email => !!email); // get rid of empty strings

    let welcomeMessage = this.welcomeMessage();
    let organizationId = this.organizationId();

    if (emails.length > 0) {
      this.modal().callMethod(inviteMultipleUsersByEmail, {
        organizationId, emails, welcomeMessage
      }, (err, res) => {
        if (err) {
          swal('Error!', `Internal server error: ${err.reason}`, 'error');
        } else {
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

          const expirationMessagePart = `\nSent invitations expire on ${moment().add(res.expirationTime, 'hours').format('MMMM Do YYYY')}`;
          swal(notificationTitle, `${successMessagePart}${failMessagePart}${expirationMessagePart}`,
            failMessagePart ? 'error' : 'success');
          this.modal().close();
        }
      });
    }
  }
});
