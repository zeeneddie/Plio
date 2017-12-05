import mount from './mount';

export const renderComponent = getComponent => (options = {}) => async (...args) => {
  const { default: component } = await getComponent();

  if (typeof options === 'function') options = await options(...args);

  mount(component, options);
};

export const renderStandards = renderComponent(async () =>
  import('../../../ui/react/standards/components/Provider'));

export const renderRisks = renderComponent(async () =>
  import('../../../ui/react/risks/components/Provider'));

export const renderCustomers = renderComponent(async () =>
  import('../../../ui/react/customers/components/Provider'));

export const renderHelpDocs = renderComponent(async () =>
  import('../../../ui/react/help-docs/components/Provider'));

export const renderTransitionalLayout = renderComponent(async () =>
  import('../../../ui/react/layouts/TransitionalLayout'));
