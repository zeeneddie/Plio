import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkOrgMembership,
  canvasSettingsUpdateAfterware,
  composeMiddleware,
} from '../../../../../share/middleware';
import { Subscriptions, DocChangeKinds } from '../../../constants';

export const resolver = async (root, args, context) =>
  context.services.CanvasSettingsService.reorderItems(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkOrgMembership(),
  composeMiddleware(
    async (next, root, args, context) => {
      // wait on next middleware which itself will wait on resolver
      const canvasSettings = await next(root, args, context);
      const { pubsub } = context;

      pubsub.publish(
        Subscriptions.CANVAS_SETTINGS_CHANGED,
        {
          [Subscriptions.CANVAS_SETTINGS_CHANGED]: {
            kind: DocChangeKinds.UPDATE,
            entity: canvasSettings,
          },
        },
      );

      return canvasSettings;
    },
    canvasSettingsUpdateAfterware(),
  ),
)(resolver);
