import { Departments } from '/imports/api/departments/departments.js';
import { insert, update, remove } from '/imports/api/departments/methods.js';


Template.Organizations_Department.viewmodel({
  mixin: 'inlineForm',
  autorun() {
    if (this._id) {
      this.department = Departments.findOne({
        _id: this._id()
      });
    }
  },
  onKeyup() {
    let savedName;
    if (this.department) {
      savedName = this.department.name;
    }

    const name = this.name();

    if (!name || name === savedName) {
      this.editMode(false);
    } else {
      this.editMode(true);
    }
  },
  onDelete() {
    return () => {
      if (!this._id) {
        this.destroy();
        return;
      }

      if (!confirm('Delete this department?')) return;

      const _id = this._id();

      remove.call({ _id }, (err, res) => {
        if (err) {
          toastr.error(err);
        } else {
          toastr.success('Department has been deleted');
        }
      });
    };
  },
  onSave() {
    return () => {
      const name = this.name();

      if (!name) return;

      if (!this._id) {
        const organizationId = this.organizationId();

        insert.call({ name, organizationId }, (err, res) => {
          if (err) {
            toastr.error(err);
          } else {
            toastr.success('Department has been created');
          }

          this.destroy();
        });
      } else {
        const _id = this._id();

        update.call({ _id, name }, (err, res) => {
          if (err) {
            toastr.error(err);
          } else {
            toastr.success('Department has been updated');
          }

          this.editMode(false);
        });
      }
    };
  }
});
