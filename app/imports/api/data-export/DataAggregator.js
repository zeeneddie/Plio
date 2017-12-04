import { _ } from 'meteor/underscore';

const PRE_LOOKUP = 'preLookupUnwinds';
const POST_LOOKUP = 'postLookupUnwinds';

class DataAggregator {
  constructor(fields, filters, mapping, organizationId) {
    this.preLookupUnwinds = [];
    this.lookups = [];
    this.postLookupUnwinds = [];
    this.project = {};
    this.group = { _id: '$_id' };

    this.fields = fields;
    this.filters = filters;
    this.mapping = mapping;
    this.organizationId = organizationId;

    this._initData();
  }

  get query() {
    return [
      {
        $match: {
          [this.mapping.filterField]: { $in: this.filters },
          organizationId: this.organizationId,
        },
      },
      ...this.preLookupUnwinds,
      ...this.lookups,
      ...this.postLookupUnwinds,
      { $project: this.project },
      { $group: this.group },
    ];
  }

  addProjectField(name, value = true) {
    this.project[name] = _.isString(value) ? `$${value}` : value;

    return this;
  }

  addGroupField(name, isArray = false) {
    const groupOperator = isArray ? '$addToSet' : '$first';

    this.group[name] = { [groupOperator]: `$${name}` };

    return this;
  }

  addUnwind(path, place) {
    this[place].push({
      $unwind: {
        path: `$${path}`,
        preserveNullAndEmptyArrays: true,
      },
    });

    return this;
  }

  addLookup(lookup) {
    this.lookups.push({
      $lookup: lookup,
    });

    return this;
  }

  fetch() {
    return this.mapping.collection.aggregate(this.query);
  }

  _initData() {
    this.fields.forEach((field) => {
      const { reference } = this.mapping.fields[field];

      // if reference not set that export by field name else by string selector
      if (!reference || _.isString(reference)) {
        this.addProjectField(field, !reference || reference);

        if (field !== '_id') this.addGroupField(field);

        return;
      }

      // the code bellow works for aggregate lookup
      const {
        from, internalField, externalField, target, many,
      } = reference;

      this
        .addUnwind(internalField, PRE_LOOKUP)
        .addLookup({
          from, localField: internalField, foreignField: externalField, as: field,
        })
        .addUnwind(field, POST_LOOKUP)
        .addProjectField(field, target ? `${field}.${target}` : true)
        .addGroupField(field, Boolean(many));
    });
  }
}

export default DataAggregator;
