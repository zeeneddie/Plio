import Handlebars from 'handlebars';

export const renderTemplate = (template, data = {}) => {
  const compiledTemplate = Handlebars.compile(template);
  return compiledTemplate(data);
};
