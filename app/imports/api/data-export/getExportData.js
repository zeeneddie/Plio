import { _ } from 'meteor/underscore';

function getExportData(fields, mapping) {
  const preUnwinds = [];
  const lookups = [];
  const unwinds = [];
  let project = { _id: false };

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

      return;
    }

    const { from, internalField, externalField, target } = reference;

    preUnwinds.push({
      $unwind: `$${internalField}`,
    });

    lookups.push({
      $lookup: {
        from,
        localField: internalField,
        foreignField: externalField,
        as: field,
      },
    });

    if (!reference.many) {
      unwinds.push({
        $unwind: `$${field}`,
      });
    }

    addProjectField(field, `${field}.${target}`);
  });

  return mapping.collection.aggregate([
    ...lookups,
    ...unwinds,
    { $project: project },
  ]);
}

export default getExportData;
