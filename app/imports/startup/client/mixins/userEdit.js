export default {
  isPropChanged(propName, newVal) {
    return newVal !== this.templateInstance.data[propName];
  },
  updateProfileProperty(e, propName, withFocusCheck) {
    const propVal = this.getData()[propName];
    let updateFn;

    if (!this.isPropChanged(propName, propVal)) {
      return;
    }

    if (propVal === '') {
      updateFn = () => {
        this.parent().unsetProfileProperty(propName);
      };
    } else {
      updateFn = () => {
        this.parent().updateProfile(propName, propVal);
      };
    }

    if (withFocusCheck) {
      this.callWithFocusCheck(e, updateFn);
    } else {
      updateFn();
    }
  },
};
