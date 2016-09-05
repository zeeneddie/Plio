import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { isMobileRes } from '/imports/api/checkers.js';

Template.Discussion_Header.viewmodel({
	share: 'window',
	mixin: ['organization', 'standard'],
	routePath() {
		const params = {
			standardId: this.standardId(),
			orgSerialNumber: this.organizationSerialNumber()
		};
		const queryParams = { filter: this.activeStandardFilterId() };
		return FlowRouter.path('standard', params, queryParams);
	},
	onNavigate(e) {
		e.preventDefault();

		const isMobile = isMobileRes();

		if (isMobile) {
			this.width(isMobile);
		}

		FlowRouter.go(this.routePath());
	}
});
