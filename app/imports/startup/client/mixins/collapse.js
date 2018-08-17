import { ViewModel } from 'meteor/manuel:viewmodel';
import { Match } from 'meteor/check';

export default {
  collapsed: true,
  toggleCollapse: _.throttle(function (cb, timeout) {
    // Callback is always the last argument
    timeout = Match.test(timeout, Number) ? timeout : null;

    if (this.closeAllOnCollapse && this.closeAllOnCollapse()) {
      const vms = ViewModel.find('ListItem', vm => vm.collapse && !vm.collapsed() && vm.vmId !== this.vmId);
      vms.forEach((vm) => {
        vm.collapse.collapse('hide');
        vm.collapsed(true);
      });
    }

    if (this.collapsed() && timeout) {
      // We need some time to render the content for collapsible sections with dynamic content
      setTimeout(() => { this.collapse.collapse('toggle'); }, timeout);
    } else {
      this.collapse.collapse('toggle');
    }

    this.collapsed(!this.collapsed());
    if (_.isFunction(cb)) cb();
  }, 500),
};
