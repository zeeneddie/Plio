import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';

Template.SectionField.viewmodel({
  mixin: ['search', 'modal', 'organization', 'collapsing'],
  onCreated() {
    if (!this.sectionId() && this.items().count() > 0) {
      const { _id, title } = this.items().fetch()[0];
      this.sectionId(_id);
      this.section(title);
    }
  },
  items: new Mongo.Collection(null),
  section: '',
  sectionId: '',
  sectionHintText() {
    return !!this.section() ? `Add "${this.section()}" section` : 'Start typing...';
  },
  addNewSection() {
    const title = this.section();

    if (!title) return;

    this.showAlert();
  },
  showAlert() {
    swal(
      {
        title: "Are you sure?",
        text: `New section "${this.section()}" will be added.`,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Add",
        closeOnConfirm: false
      },
      () => {
        this.onAlertConfirm();
      }
    );
  },
  onAlertConfirm() {
    const cb = (err, _id) => {
      if (err) {
        swal('Oops... Something went wrong!', err.reason, 'error');
      } else {
        swal("Added!", `Section "${this.section()}" was added successfully.`, "success");

        this.sectionId(_id);

        this.update();
      }
    };

    this.onAddSection(this, cb);
  },
  update() {
    const _id = this.sectionId();

    if (!!_id && !this.section()) {
      const find = this.items().fetch().filter(doc => doc._id === _id);
      const item = !!find.length > 0 && find[0];
      this.section(item.title);
    }

    if (_id === this.templateInstance.data.sectionId) return;

    this.onUpdate(this);
  },
  getData() {
    const { section, sectionId } = this.data();
    return { section, sectionId };
  },
  events: {
    'focus input'() {
      this.section('');
    }
  }
});
