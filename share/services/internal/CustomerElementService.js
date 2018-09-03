import { generateSerialNumber } from '../../../share/helpers';

export default {
  async insert(args, context) {
    const {
      organizationId,
      title,
      description,
      importance,
      linkedTo,
    } = args;
    const { userId } = context;
    const collection = await this.collection(context);
    const serialNumber = generateSerialNumber(collection, { organizationId });

    return collection.insert({
      organizationId,
      createdBy: userId,
      serialNumber,
      title,
      description,
      importance,
      linkedTo,
    });
  },
};
