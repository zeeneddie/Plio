import mount from './mount';

export const renderComponent = getComponent => options => async (...args) => {
  let opts = options || {};
  const { default: component } = await getComponent();

  if (typeof opts === 'function') opts = await options(...args);

  mount(component, opts);
};

export const renderStandards = renderComponent(async () =>
  import('../../../ui/react/standards/components/Provider'));

export const renderRisks = renderComponent(async () =>
  import('../../../ui/react/risks/components/Provider'));

export const renderCustomers = renderComponent(async () =>
  import('../../../ui/react/customers/components/Provider'));

export const renderHelpDocs = renderComponent(async () =>
  import('../../../ui/react/help-docs/components/HelpDocsProvider'));

export const renderTransitionalLayout = renderComponent(async () =>
  import('../../../ui/react/layouts/TransitionalLayout'));
