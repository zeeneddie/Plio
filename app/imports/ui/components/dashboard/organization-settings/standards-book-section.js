import {
  StandardsBookSections
} from '/imports/api/standards-book-sections/standards-book-sections.js';
import {
  insert, update, remove
} from '/imports/api/standards-book-sections/methods.js';


Template.OrganizationSettings_StandardsBookSection.viewmodel({
  title: '',
  onCreated() {
    if (this._id) {
      this.title(`${this.number()}. ${this.name()}`);
    }
  },
  shouldSave() {
    const tplData = this.templateInstance.data;
    const storedName = tplData.name;
    const storedNum = tplData.number;

    const { name, number } = this.getData();

    return _.every([
      name && number,
      (name !== storedName) || (number !== storedNum)
    ]);
  },
  save() {
    if (!this.shouldSave()) return;

    const { name, number } = this.getData();

    if (!this._id) {
      const organizationId = this.organizationId();

      insert.call({ name, number, organizationId }, (err, res) => {
        if (err) {
          console.log(err);
          toastr.error('Failed to create a standards book section');
        }

        this.destroy();
      });
    } else {
      const _id = this._id();

      update.call({ _id, name, number }, (err, res) => {
        if (err) {
          toastr.error('Failed to update a standards book section');
        }
      });
    }
  },
  delete() {
    if (!this._id) {
      this.destroy();
      return;
    }

    if (!confirm('Delete this standards book section?')) return;

    const _id = this._id();

    remove.call({ _id }, (err, res) => {
      if (err) {
        toastr.error('Failed to remove a standards book section');
      }
    });
  },
  getData() {
    let name, number;

    const title = this.title();
    const regex = /^([0-9]+)(?:\.|\s)\s*(\S+)$/;

    const match = title.match(regex);
    if (match) {
      number = Number(match[1]);
      name = match[2];
    }

    return { name, number };
  },
  destroy() {
    Blaze.remove(this.templateInstance.view);
  }
});
