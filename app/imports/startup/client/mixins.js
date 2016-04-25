import { ViewModel } from 'meteor/manuel:viewmodel';

ViewModel.mixin({
  collapse: {
    collapsed: true,
    toggleCollapse: _.throttle(function() {
      this.collapse.collapse('toggle');
      this.collapsed(!this.collapsed());
    }, 500),
  },
  modal: {
    open(data) {
      Blaze.renderWithData(Template.ModalWindow, data, document.body);
    }
  }
});
