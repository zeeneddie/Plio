Template.Organizations_NcGuideline.viewmodel((context = {}) => {
  const { text = '' } = context;

  return {
    text: '',
    onCreated() {
      this.load({ text });
    },
    getData() {
      return {
        text: this.text()
      };
    }
  };
});
