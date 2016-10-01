import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { isMobileRes } from '/imports/api/checkers.js';

Template.ListItemLink.viewmodel({
  share: 'window',
  linkArgs() {
    const { isActive, href, onClick } = this.templateInstance.data;
    const active = isActive ? 'active' : '';
    const className = `list-group-item ${active}`;
    return {
      className,
      href,
      onClick: (e) => {
        _.isFunction(onClick) && onClick((params) => {
          const mobileWidth = isMobileRes();

          if (mobileWidth) {
            this.width(mobileWidth);
          }

          FlowRouter.setParams(params);
        });
      }
    }
  }
});
