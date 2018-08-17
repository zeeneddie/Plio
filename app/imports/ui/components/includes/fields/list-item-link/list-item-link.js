import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { isMobileRes } from '/imports/api/checkers';

Template.ListItemLink.viewmodel({
  share: 'window',
  linkArgs() {
    const {
      isActive, href, onClick, className,
    } = this.templateInstance.data;
    const active = isActive ? 'active' : '';
    const finalClassName = `list-group-item ${className} ${active}`;
    return {
      className: finalClassName,
      href,
      onClick: (e) => {
        _.isFunction(onClick) && onClick((params) => {
          const mobileWidth = isMobileRes();

          if (mobileWidth) {
            this.width(mobileWidth);
          }

          FlowRouter.setParams(params);
        });
      },
    };
  },
});
