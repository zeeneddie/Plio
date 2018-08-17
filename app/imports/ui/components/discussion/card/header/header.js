import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { isMobileRes } from '/imports/api/checkers';

Template.Discussion_Header.viewmodel({
  share: 'window',
  mixin: ['organization', 'standard'],
  routePath() {
    const currentPath = FlowRouter.current().path;
    return currentPath.replace('/discussion', '');
  },
  onNavigate(e) {
    e.preventDefault();

    const isMobile = isMobileRes();

    if (isMobile) {
      this.width(isMobile);
    }

    FlowRouter.go(this.routePath());
  },
});
