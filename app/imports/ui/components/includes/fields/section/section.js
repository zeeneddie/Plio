import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';

Template.SectionField.viewmodel({
  mixin: ['search', 'modal', 'organization', 'collapsing'],
  onCreated() {
    const items = this.items();
    const isCursor = !_.isArray(items);
    const hasItems = isCursor ? items.count() > 0 : items.length > 0;

    this.Items().remove({});
    items.forEach(item => this.Items().insert(item));

    if (!this.sectionId() && !!hasItems) {
      const { _id, title } = isCursor ? items.fetch()[0] : items[0];
      this.sectionId(_id);
      this.section(title);
    }
  },
  items: [],
  Items: new Mongo.Collection(null),
  section: '',
  sectionId: '',
  filtered() {
    const query = this.searchObject('section', 'title');
    const options = { sort: { title: 1 } };
    return this.Items().find(query, options);
  },
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

    this.parent().addNewSection(this, cb);
  },
  update(e) {
    const _id = this.sectionId();

    if (!!_id && !this.section()) {
      const item = this.Items().findOne({ _id });
      this.section(item.title);
    }

    if (_id === this.templateInstance.data.sectionId) return;

    this.parent().update(e, this);
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
