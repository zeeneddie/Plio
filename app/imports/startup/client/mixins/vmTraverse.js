import { ViewModel } from 'meteor/manuel:viewmodel';

const checker = instance => instance && instance instanceof ViewModel;
const byName = (name, instance) => Object.is(instance.templateName(), name) && instance;

export default {
  VMFindParent(predicate, instance) {
    if (!checker(instance)) return;

    if (_.isString(predicate)) {
      return byName(predicate, instance) || this.VMFindParent(predicate, instance.parent());
    }

    return (predicate(instance) && instance) || this.VMFindParent(predicate, instance.parent());
  },
  // VMFindChildren(predicate, instance) {
  //   if (!checker(instance)) return;
  //
  //   if (_.isString(predicate)) {
  //     const result = instance.children(vm => byName(predicate, vm));
  //     return (result.length && result) || instance.children(vm => this.VMFindChildren(predicate, vm));
  //   }
  //
  //   return instance.children(vm => predicate(vm) || this.VMFindChildren(predicate, vm));
  // }
};
