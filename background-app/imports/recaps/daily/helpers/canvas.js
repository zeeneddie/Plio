import pluralize from 'pluralize';

export const getDailyRecapCanvasTitle = ({ count, description }) =>
  `${count} ${pluralize(description, count)} ${pluralize('was', count)} ` +
  'updated in the business model canvas:';
