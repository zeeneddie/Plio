import { ViewModel } from 'meteor/manuel:viewmodel';

ViewModel.mixin({
  collapse: {
    collapsed: true,
    toggleCollapse: _.throttle(function() {
      if (this.closeAllOnCollapse && this.closeAllOnCollapse()) {
        // hide other collapses
        ViewModel.find('ListItem').forEach((vm) => {
          if (vm && vm.collapse && !vm.collapsed() && vm.vmId !== this.vmId) {
            vm.collapse.collapse('hide');
            vm.collapsed(true);
          }
        });
      }
      this.collapse.collapse('toggle');
      this.collapsed(!this.collapsed());
    }, 500),
  },
  modal: {
    open(data) {
      Blaze.renderWithData(Template.ModalWindow, data, document.body);
    },
    destroy() {
      const vm = ViewModel.findOne('ModalWindow');
      return vm && vm.modal.modal('hide');
    }
  },
  search: {
    searchObject(prop, fields) {
      const searchObject = {};
      if (this[prop]()) {
        const r = new RegExp(`.*${this[prop]()}.*`, 'i');
        if (_.isArray(fields)) {
          fields = _.map(fields, (field) => {
            const obj = {};
            obj[field] = r;
            return obj;
          });
          searchObject['$or'] = fields;
        } else {
          searchObject[fields] = r;
        }
      }
      return searchObject;
    }
  },
  fullName: {
    fullName(doc) {
      const { profile } = doc;
      const { firstName, lastName } = profile;
      return `${firstName} ${lastName}`;
    }
  }
});
