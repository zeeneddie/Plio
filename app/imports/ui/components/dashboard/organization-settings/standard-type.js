import { StandardTypes } from '/imports/api/standard-types/standard-types.js';
import { insert, update, remove } from '/imports/api/standard-types/methods.js';


Template.Organizations_StandardType.viewmodel({
  autorun() {
    if (this._id) {
      this.standardType = StandardTypes.findOne({
        _id: this._id()
      });
    }
  },
  onKeyup() {
    let storedName, storedAbbr;
    if (this.standardType) {
      storedName = this.standardType.name;
      storedAbbr = this.standardType.abbreviation;
    }

    const name = this.name();
    const abbreviation = this.abbreviation();

    const editMode = _.every([
      name && abbreviation,
      (name !== storedName) || (abbreviation !== storedAbbr)
    ]);

    if (editMode) {
      this.editMode(true);
    } else {
      this.editMode(false);
    }
  },
  onDelete() {
    return () => {
      if (!this._id) {
        this.destroy();
        return;
      }

      if (!confirm('Delete this standard type?')) return;

      const _id = this._id();

      remove.call({ _id }, (err, res) => {
        if (err) {
          toastr.error(err);
        } else {
          toastr.success('Standard type has been deleted');
        }
      });
    };
  },
  onSave() {
    return () => {
      const name = this.name();
      const abbreviation = this.abbreviation();

      if (!(name && abbreviation)) return;

      if (!this._id) {
        const organizationId = this.organizationId();

        insert.call({ name, abbreviation, organizationId }, (err, res) => {
          if (err) {
            toastr.error(err);
          } else {
            toastr.success('Standard type has been created');
          }

          this.destroy();
        });
      } else {
        const _id = this._id();

        update.call({ _id, name, abbreviation }, (err, res) => {
          if (err) {
            toastr.error(err);
          } else {
            toastr.success('Standard type has been updated');
          }

          this.editMode(false);
        });
      }
    };
  },
  destroy() {
    Blaze.remove(this.templateInstance.view);
  }
});
