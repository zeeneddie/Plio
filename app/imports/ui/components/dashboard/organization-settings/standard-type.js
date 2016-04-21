import { StandardTypes } from '/imports/api/standard-types/standard-types.js';
import { insert, update, remove } from '/imports/api/standard-types/methods.js';


Template.Organizations_StandardType.viewmodel({
  shouldSave() {
    const tplData = this.templateInstance.data;
    const storedName = tplData.name;
    const storedAbbr = tplData.abbreviation;

    const name = this.name();
    const abbreviation = this.abbreviation();

    return _.every([
      name && abbreviation,
      (name !== storedName) || (abbreviation !== storedAbbr)
    ]);
  },
  delete() {
    if (!this._id) {
      this.destroy();
      return;
    }

    if (!confirm('Delete this standard type?')) return;

    const _id = this._id();

    remove.call({ _id }, (err, res) => {
      if (err) {
        toastr.error(err);
      }
    });
  },
  save() {
    if (!this.shouldSave()) return;

    const name = this.name();
    const abbreviation = this.abbreviation();

    if (!this._id) {
      const organizationId = this.organizationId();

      insert.call({ name, abbreviation, organizationId }, (err, res) => {
        if (err) {
          toastr.error(err);
        }

        this.destroy();
      });
    } else {
      const _id = this._id();

      update.call({ _id, name, abbreviation }, (err, res) => {
        if (err) {
          toastr.error(err);
        }
      });
    }
  },
  destroy() {
    Blaze.remove(this.templateInstance.view);
  }
});
