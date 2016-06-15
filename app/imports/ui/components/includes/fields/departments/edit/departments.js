import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

import { Departments } from '/imports/api/departments/departments.js';

Template.Departments_Edit.viewmodel({
  mixin: ['search', 'organization'],
  departmentsIds: [],
  departmentsIdsArray() {
    return Array.from(this.departmentsIds() || []);
  },
  departmentSearchText() {
    const child = this.child('SelectItem');
    return child && child.value();
  },
  departments() {
    const ids = this.departmentsIdsArray();
    const query = {
      ...this.searchObject('departmentSearchText', 'name'),
      organizationId: this.organizationId(),
      _id: { $nin: ids }
    };

    return Departments.find(query).map(({ name, _id }) => ({ title: name, name, _id }));
  },
  currentDepartments() {
    const ids = this.departmentsIdsArray();
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

    if (this.departmentsIdsArray().find(id => id === departmentId)) return;

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

    if (!this.departmentsIdsArray().find(id => id === _id)) return;

    this.update(_id, '$pull');
  }
});
