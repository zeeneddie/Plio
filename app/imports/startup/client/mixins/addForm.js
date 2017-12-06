import { Blaze } from 'meteor/blaze';
import { Template } from 'meteor/templating';

export default {
  addForm(template, context = {}, parentNode, nextNode, parentView) {
    if (_.isFunction(this.onChangeCb)) {
      context.onChange = this.onChangeCb();
    }

    if (_.isFunction(this.onDeleteCb)) {
      context.onDelete = this.onDeleteCb();
    }

    return Blaze.renderWithData(
      Template[template],
      context,
      parentNode || _.first(this.forms),
      nextNode,
      parentView || this.templateInstance.view,
    );
  },
};
