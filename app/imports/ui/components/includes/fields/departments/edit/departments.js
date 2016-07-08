import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

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
      ...this.searchObject('value', 'name')
    };

    return this._getDepartmentsByQuery(query);
  },
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { selectedItemId, selected } = viewmodel.getData();
    if(this.areIdsIncludesItemId(selectedItemId)) return;

    const departmentsIds = this.departmentsIds().concat([selectedItemId]);
    this.departmentsIds(departmentsIds);

    this.callUpdate(selectedItemId, '$addToSet', selected);
  },
  callUpdate(selectedItemId, option, selected) {
    if (selected.length === this.selected().length &&
        selected.every( ({ _id:itemId }) => this.selected().find(
          ({ _id }) => _id === itemId) )
      ) return;

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
    const { selectedItemId, selected } = viewmodel.getData();
    if(!this.areIdsIncludesItemId(selectedItemId)) return;

    const departmentsIds = this.departmentsIds().filter(
      _id => _id !== selectedItemId
    );
    this.departmentsIds(departmentsIds);

    this.callUpdate(selectedItemId, '$pull', selected);
  },
  areIdsIncludesItemId(selectedItemId) {
    return this.departmentsIds().includes(selectedItemId);
  },
  getData() {
    const { departmentsIds } = this.data();
    return { departmentsIds };
  }
});
