import { _ } from 'meteor/underscore';

function getExportData(fields, mapping) {
  const preUnwinds = [];
  const preLookup = [];
  const lookups = [];
  const unwinds = [];
  let project = {};
  let group = { _id: '$_id' };

  function addProjectField(field, value) {
    project = {
      ...project,
      [field]: _.isString(value) ? `$${value}` : value,
    };
  }

  fields.forEach(field => {
    const { reference } = mapping.fields[field];

    // if reference not set that export by field name else by string selector
    if (!reference || _.isString(reference)) {
      addProjectField(field, !reference || reference);

      if (field !== '_id') {
        group = {
          ...group,
          [field]: { $first: `$${field}` },
        };
      }

      return;
    }

    const { from, internalField, externalField, target } = reference;

    preUnwinds.push({
      path: `$${internalField}`,
      preserveNullAndEmptyArrays: true,
    });
    preLookup.push({
      $project: {
        [internalField]: { $ifNull: [`$${internalField}`, 'Unspecified'] },
      },
    });
    lookups.push({
      $lookup: {
        from,
        localField: internalField,
        foreignField: externalField,
        as: field,
      },
    });

    unwinds.push({
      $unwind: {
        path: `$${field}`,
        preserveNullAndEmptyArrays: true,
      },
    });

    addProjectField(field, `${field}.${target}`);


    group = {
      ...group,
      [field]: mapping.fields[field].reference.many
        ? { $addToSet: `$${field}` }
        : { $first: `$${field}` },
    };
  });


  return mapping.collection.aggregate([
    ...preUnwinds,
    ...preLookup,
    ...lookups,
    ...unwinds,
    { $project: project },
    { $group: group },
  ]);
}

export default getExportData;
