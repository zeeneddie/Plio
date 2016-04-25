Template.OrganizationSettings_StandardsBookSection.viewmodel({
  name: '',
  number: '',
  title: '',
  autorun() {
    if (this._id) {
      this.title(`${this.number()}. ${this.name()}`);
    }
  },
  isChanged() {
    const context = this.templateInstance.data;
    const storedName = context.name;
    const storedNum = context.number;

    const { name, number } = this.getData();

    return _.every([
      name && number,
      (name !== storedName) || (number !== storedNum)
    ]);
  },
  onFocusOut() {
    this.updateData();

    if (this.isChanged()) {
      this.onChange(this);
    }
  },
  delete() {
    this.onDelete(this);
  },
  updateData() {
    const title = this.title();
    const regex = /^([0-9]+)(?:\.|\s)\s*([a-z].+)$/i;
    const match = title.match(regex);
    
    if (match) {
      number = Number(match[1]);
      name = match[2];

      this.name(name);
      this.number(number);
    }
  },
  getData() {
    return { 
      name: this.name(), 
      number: Number(this.number()) 
    };
  }
});
