export default AuditConfigs = {

  _auditConfigs: { },

  add(config) {
    this._auditConfigs[config.collectionName] = config;
  },

  get(collectionName) {
    return this._auditConfigs[collectionName];
  }

};
