import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import mount from './mount';

/*
  render(renderer: (component: Any, options: Object) => Any) =>
  (getComponent: () => Promise) =>
  (options: Object | (...args: [...Any]) => Promise) =>
  (...args: [...Any]) => Any
*/

export const render = renderer => getComponent => options => async (...args) => {
  let opts = options || {};
  let component = await getComponent();

  if (component.default) component = component.default;

  if (typeof opts === 'function') opts = await options(...args);

  await import('../../../ui/components');

  renderer(component, opts);
};

export const renderComponent = render(mount);

export const renderBlazeComponent = render(BlazeLayout.render.bind(BlazeLayout));

/* REACT */

export const renderStandards = renderComponent(async () => {
  const [StandardsProvider] = await Promise.all([
    import('../../../client/react/standards/components/Provider'),
    import('../../../ui/components/standards'),
  ]);

  return StandardsProvider;
});

export const renderRisks = renderComponent(async () =>
  import('../../../client/react/risks/components/Provider'));

export const renderCustomers = renderComponent(async () =>
  import('../../../client/react/customers/components/Provider'));

export const renderHelpDocs = renderComponent(async () =>
  import('../../../client/react/help-docs/components/HelpDocsProvider'));

export const renderTransitionalLayout = renderComponent(async () =>
  import('../../../client/react/layouts/TransitionalLayout'));

export const renderCanvasLayout = renderComponent(async () => {
  const [CanvasLayout] = await Promise.all([
    import('../../../client/react/canvas/components/CanvasLayout'),
    // fetch necessary blaze components
    import('../../../ui/components/dashboard/includes/user-menu'),
  ]);

  // don't wait for other blaze components because they aren't immediately needed
  import('../../../ui/components');

  return CanvasLayout;
});

export const renderCanvasReportLayout = renderComponent(async () =>
  import('../../../client/react/canvas/components/CanvasReportLayout'));

export const renderDashboard = renderComponent(async () =>
  import('../../../client/react/dashboard/components/DashboardLayout'));

/* BLAZE */

export const renderNcs = renderBlazeComponent(async () => {
  await Promise.all([
    import('../../../ui/layouts/non-conformities-layout'),
    import('../../../ui/pages/non-conformities-page'),
    import('../../../ui/components/potential-gains'),
  ]);

  return 'NC_Layout';
});

export const renderWorkInbox = renderBlazeComponent(async () => {
  await Promise.all([
    import('../../../ui/layouts/work-inbox-layout'),
    import('../../../ui/pages/work-inbox-page'),
  ]);

  return 'WorkInbox_Layout';
})({ content: 'WorkInbox_Page' });

export const renderUserDirectory = renderBlazeComponent(async () => {
  await Promise.all([
    import('../../../ui/layouts/user-directory-layout'),
    import('../../../ui/pages/user-directory-page'),
    import('../../../ui/components/userdirectory'),
  ]);

  return 'UserDirectory_Layout';
})({ content: 'UserDirectory_Page' });
