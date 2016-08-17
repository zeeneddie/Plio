import { Template } from 'meteor/templating';

import { Messages } from '/imports/api/messages/messages.js';


Template.Discussion_Header.viewmodel({
	mixin: ['organization', 'standard'],
	getStandardFilter() {
		return 'filter=' + this.activeStandardFilterId();
	}
});
