import { Template } from 'meteor/templating';
import { inviteMultipleUsersByEmail } from '/imports/api/organizations/methods'

Template.UserDirectory_InviteUsers.viewmodel({
  welcomeMessage: 'Hi there.\n We\'ll be using Plio to store documents, complete worksheets and track issues during this project.',
  usersEntries: _.range(1, 5).map((i) => {
    return {avatarIndex: i};
  }),

  onSubmitModal() {
    let modalWindowInstance = this.child('ModalWindow');

    let emailViewModels = this.children('UserDirectory_InviteUsers_UserEntry');

    let emails = emailViewModels
      .map(userEntryViewModel => userEntryViewModel.email()) // get emails
      .filter(email => !!email); // get rid of empty strings

    let welcomeMessage = this.welcomeMessage();
    let organizationId = this.organizationId();


    if (emails.length > 0) {
      modalWindowInstance.callMethod(inviteMultipleUsersByEmail, {
        organizationId, emails, welcomeMessage
      });
    }
  }
});