function stripHtml(text) {
  return text && text.replace(/<[^>]*>/g, '');
}

export { stripHtml };
