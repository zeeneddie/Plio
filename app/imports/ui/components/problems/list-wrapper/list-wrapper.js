import { Template } from 'meteor/templating';

import { ProblemsStatuses } from '/imports/share/constants';
import { lengthItems, inspire } from '/imports/api/helpers';
import { Departments } from '/imports/share/collections/departments';
import { NonConformities } from '../../../../share/collections';
import { sortByType } from '../../../../api/non-conformities/util';

Template.Problems_ListWrapper.viewmodel({
  share: 'search',
  mixin: ['organization', 'search'],
  statusesData: ProblemsStatuses,
  listArgs() {
    return {
      ...inspire([
        'statuses', 'departments', 'deleted',
        '_getSearchQuery', '_getSearchOptions',
      ], this),
    };
  },
  _getMainQuery() {
    return {
      ...this._getSearchQuery(),
      organizationId: this.organizationId(),
      isDeleted: {
        $in: [null, false],
      },
    };
  },
  _getSearchQuery() {
    const fields = [{ name: 'title' }, { name: 'sequentialId' }];

    return this.searchObject('searchText', fields, this.isPrecise());
  },
  _getSearchOptions(defaults = { sort: { createdAt: -1 } }) {
    return this.searchText()
      ? { sort: { sequentialId: 1, title: 1 } }
      : defaults;
  },
  statuses() {
    const collection = this.collection();
    const searchOptions = this._getSearchOptions();
    const mapper = (status) => {
      const query = { ...this._getMainQuery(), status };
      let items = collection.find(query, searchOptions).fetch();

      if (collection === NonConformities) {
        items = sortByType(items);
      }

      return { status, items };
    };
    const keys = Object.keys(this.statusesData()).map(s => parseInt(s, 10));

    return keys.map(mapper).filter(lengthItems);
  },
  departments() {
    const organizationId = this.organizationId();
    const mainQuery = this._getMainQuery();
    const collection = this.collection();
    const searchOptions = this._getSearchOptions();

    const mapper = (department) => {
      const query = {
        ...mainQuery,
        departmentsIds: department._id,
      };
      let items = collection.find(query, searchOptions).fetch();

      if (collection === NonConformities) {
        items = sortByType(items);
      }

      return { ...department, items };
    };

    const departments = ((() => {
      const query = { organizationId };
      const options = { sort: { name: 1 } };

      return Departments.find(query, options).fetch();
    })());

    const uncategorized = ((() => {
      const filterFn = nc => !departments.find(department =>
        nc.departmentsIds.includes(department._id));
      let items = collection
        .find(mainQuery, searchOptions)
        .fetch()
        .filter(filterFn);

      if (collection === NonConformities) {
        items = sortByType(items);
      }

      return {
        organizationId,
        items,
        _id: 'NonConformities.departments.uncategorized',
        name: 'Uncategorized',
      };
    })());

    return departments
      .map(mapper)
      .concat(uncategorized)
      .filter(lengthItems);
  },
  deleted() {
    const query = { ...this._getMainQuery(), isDeleted: true };
    const options = this._getSearchOptions({ sort: { deletedAt: -1 } });
    const collection = this.collection();
    let items = collection.find(query, options).fetch();

    if (collection === NonConformities) {
      items = sortByType(items);
    }

    return items;
  },
});
