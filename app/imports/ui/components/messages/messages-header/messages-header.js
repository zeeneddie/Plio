import { Template } from 'meteor/templating';

import { Messages } from '/imports/api/messages/messages.js';


Template.MessagesHeader.viewmodel({
	mixin: ['organization', 'standard'],
	getStandardFilter() {
		return 'by=' + this.activeStandardFilter();
	}
});
