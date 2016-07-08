import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

import { Departments } from '/imports/api/departments/departments.js';

Template.Departments_Edit.viewmodel({
  mixin: ['search', 'organization', 'department'],
  departmentsIds: [],
  selected() {
    const departmentsIds = Array.from(this.departmentsIds() || []);
    return this._getDepartmentsByQuery( {_id: { $in: departmentsIds }} );
  },
  value() {
    const child = this.child('Select_Multi');
    return child && child.value();
  },
  departments() {
    const query = {
      ...this.searchObject('value', 'name'),
      organizationId: this.organizationId()
    };
    const options = { sort: { name: 1 } };

    return Departments.find(query, options).map(({ name, ...args }) => ({ title: name, name, ...args }));
  },
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { selectedItemId } = viewmodel.getData();
    if(this.departmentsIds().includes(selectedItemId)) return;

    this.callUpdate(viewmodel, '$addToSet');
  },
  callUpdate(viewmodel, option) {
    const { selected = [], selectedItemId } = viewmodel.getData();

    if (selected.length === 0 && this._id) {
      ViewModel.findOne('ModalWindow').setError('A document must be linked to at least one standard.');
      viewmodel.selected(this.selected());
      return;
    }

    const departmentsIds = selected.map(({ _id }) => _id);

    this.departmentsIds(departmentsIds);

    if (!this._id) return;

    const options = {
      [`${option}`]: {
        departmentsIds: selectedItemId
      }
    };

    this.parent().update({ options });
  },
  onRemoveCb() {
    return this.remove.bind(this);
  },
  remove(viewmodel) {
    const { selectedItemId } = viewmodel.getData();
    if(!this.departmentsIds().includes(selectedItemId)) return;

    this.callUpdate(viewmodel, '$pull');
  },
  getData() {
    const { departmentsIds } = this.data();
    return { departmentsIds };
  }
});
