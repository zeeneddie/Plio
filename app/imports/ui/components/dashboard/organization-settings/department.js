import { Departments } from '/imports/api/departments/departments.js';
import { insert, update, remove } from '/imports/api/departments/methods.js';


Template.Organizations_Department.viewmodel({
  shouldSave() {
    let savedName = this.templateInstance.data.name;
    const name = this.name();

    return name && name !== savedName;
  },
  save() {
    if (!this.shouldSave()) return;

    const name = this.name();

    if (!this._id) {
      const organizationId = this.organizationId();

      insert.call({ name, organizationId }, (err, res) => {
        if (err) {
          toastr.error(err);
        }

        this.destroy();
      });
    } else {
      const _id = this._id();

      update.call({ _id, name }, (err, res) => {
        if (err) {
          toastr.error(err);
        }
      });
    }
  },
  delete() {
    if (!this._id) {
      this.destroy();
      return;
    }

    if (!confirm('Delete this department?')) return;

    const _id = this._id();

    remove.call({ _id }, (err, res) => {
      if (err) {
        toastr.error(err);
      }
    });
  },
  destroy() {
    Blaze.remove(this.templateInstance.view);
  }
});
