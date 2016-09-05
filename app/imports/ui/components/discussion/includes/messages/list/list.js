import { Template } from 'meteor/templating';

Template.Discussion_Messages_List.viewmodel({
  messages: [],
  onRendered() {
    if (!FlowRouter.getQueryParam('at')) {
			const $chat = $(this.templateInstance.firstNode).closest('.chat-content');
      const $chatScrollHeight = $chat.prop('scrollHeight');

			$chat.scrollTop($chatScrollHeight);
		}
  }
});
