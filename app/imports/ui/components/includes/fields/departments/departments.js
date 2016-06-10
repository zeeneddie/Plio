import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

import { Departments } from '/imports/api/departments/departments.js';

Template.Departments_Edit.viewmodel({
  mixin: ['search', 'organization'],
  departmentsIds: [],
  departmentSearchText() {
    const child = this.child('SelectItem');
    return child && child.value();
  },
  departments() {
    const ids = Array.from(this.departmentsIds() || []);
    const query = {
      ...this.searchObject('departmentSearchText', 'name'),
      organizationId: this.organizationId(),
      _id: { $nin: ids }
    };

    return Departments.find(query).map(({ name, _id }) => ({ title: name, name, _id }));
  },
  currentDepartments() {
    const ids = Array.from(this.departmentsIds() || []);
    const query = { _id: { $in: ids }, organizationId: this.organizationId() };
    return Departments.find(query);
  },
  update(departmentId, option, cb) {
    const options = {
      [`${option}`]: {
        departments: departmentId
      }
    };

    this.parent().update({ options }, cb);
  },
  onSelectCb() {
    return this.onSelect.bind(this);
  },
  onSelect(viewmodel) {
    const { selected:departmentId } = viewmodel.getData();

    if (this.departmentsIds().find(id => id === departmentId)) return;

    const cb = () => {
      viewmodel.value('');
      viewmodel.selected('');
    };

    this.update(departmentId, '$addToSet', cb);
  },
  onRemoveCb() {
    return this.remove.bind(this);
  },
  remove(e) {
    const { _id } = Blaze.getData(e.target);

    if (!this.departmentsIds().find(id => id === _id)) return;

    this.update(_id, '$pull');
  }
});
