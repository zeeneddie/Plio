import { Channels } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';
import { getChannelDesc, getCanvasDocName } from '../../../helpers/description';
import { getCanvasUrl } from '../../../helpers/url';
import { getDailyRecapCanvasTitle } from '../helpers/canvas';

export default ({ organization: { serialNumber } }) => ({
  collection: Channels,
  collectionName: CollectionNames.CHANNELS,
  title: getDailyRecapCanvasTitle,
  description: getChannelDesc(),
  getDocConfig: channel => ({
    title: getCanvasDocName(channel),
    url: getCanvasUrl(serialNumber),
  }),
});
