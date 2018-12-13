import { Template } from 'meteor/templating';
import { mapEntitiesToOptions } from 'plio-util';
import { compose, concat, difference } from 'ramda';

import { Projects } from '../../../../../share/collections';
import { CategorizeFieldBlazeWrap } from '../../../../../client/react/components';
import {
  addDepartmentType,
  addProjectType,
} from '../../../../../client/react/helpers/categorize';
import { CategorizeTypes } from '../../../../../api/constants';

const getDepartmentOptions = compose(
  addDepartmentType,
  mapEntitiesToOptions,
);
const getProjectOptions = compose(
  addProjectType,
  mapEntitiesToOptions,
);

Template.Categorize.viewmodel({
  mixin: ['organization', 'department'],
  label: 'Categorize',
  placeholder: 'Add category',
  departmentsIds: [],
  selected() {
    const departmentsIds = Array.from(this.departmentsIds() || []);
    const projectIds = Array.from(this.projectIds() || []);
    const departments = this._getDepartmentsByQuery({ _id: { $in: departmentsIds } });
    const projects = Projects.find({ _id: { $in: projectIds } }).fetch();
    return concat(
      getDepartmentOptions(departments),
      getProjectOptions(projects),
    );
  },
  callUpdate({ value, type }, operator) {
    const _id = this._id && this._id();

    if (!_id) return;

    const options = {
      [`${operator}`]: {
        [type === CategorizeTypes.DEPARTMENT ? 'departmentsIds' : 'projectIds']: value,
      },
    };

    this.parent().update({ options });
  },
  onChangeCb() {
    return this.change.bind(this);
  },
  change(options) {
    const selectedOption = difference(options, this.selected())[0];
    const removedOption = difference(this.selected(), options)[0];
    let operator;

    if (selectedOption) operator = '$addToSet';
    if (removedOption) operator = '$pull';

    if (operator) {
      this.callUpdate(selectedOption || removedOption, operator);
    }
  },
  CategorizeField: () => CategorizeFieldBlazeWrap,
});
