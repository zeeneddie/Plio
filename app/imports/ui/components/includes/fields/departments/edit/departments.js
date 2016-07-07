import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

import { Departments } from '/imports/api/departments/departments.js';

Template.Departments_Edit.viewmodel({
  mixin: ['search', 'organization'],
  departmentsIds: [],
  selected() {
    const departmentsIds = Array.from(this.departmentsIds() || []);
    const query = { organizationId: this.organizationId(), _id: { $in: departmentsIds } };
    const options = { sort: { name: 1 } };
    return Departments.find(query, options).map(({ name, ...args }) => ({ title: name, name, ...args }));
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
  update(viewmodel, option = '$addToSet') {
    const { selected = [], selectedItemId } = viewmodel.getData();

    if (selected.length === this.selected().length > 0 &&  selected.every(({ _id:itemId }) => this.selected().find(({ _id }) => _id === itemId))) return;

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
    this.update(viewmodel, '$pull');
  },
  getData() {
    const { departmentsIds } = this.data();
    return { departmentsIds };
  }
});
