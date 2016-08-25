export default (base) => class extends base {

  _buildLogs() {
    _(this._diff).each(diff => {
      if (diff.isProcessed) {
        return;
      }

      switch (diff.field) {
        case 'improvementPlan':
          this._improvementPlanChanged(diff);
          break;
        case 'improvementPlan.files':
          this._filesChanged(diff);
          break;
        case 'improvementPlan.files.$.url':
          this._fileUrlChanged(diff);
          break;
        case 'improvementPlan.reviewDates':
          this._improvementPlanReviewDatesChanged(diff);
          break;
        case 'improvementPlan.owner':
          this._userChanged(diff);
          break;
      }
    });

    super._buildLogs();
  }

  _improvementPlanChanged(diff) {
    const { FIELD_ADDED, FIELD_REMOVED } = this.constructor._changesTypes;

    const { kind, newValue:plan, field } = diff;

    if (kind === FIELD_REMOVED) {
      this._createLog({ message: 'Improvement plan removed', field });
      diff.isProcessed = true;
    }

    if (!((kind === FIELD_ADDED) && _(plan).isObject())) {
      return;
    }

    const { owner, reviewDates, targetDate } = plan;
    const planDesc = [];

    if (owner !== undefined) {
      const ownerDoc = Meteor.users.findOne({ _id: owner });
      const ownerName = (ownerDoc && ownerDoc.fullNameOrEmail()) || owner;
      planDesc.push(`owner - ${ownerName}`);
    }

    if (_(reviewDates).isArray() && reviewDates.length) {
      const dates = _(reviewDates).map(
        ({ date }) => this._getPrettyDate(date)
      ).join(', ');
      planDesc.push(`review dates - ${dates}`);
    }

    if (targetDate !== undefined) {
      const date = this._getPrettyDate(targetDate);
      planDesc.push(`target date for desired outcome - ${date}`);
    }

    let message;
    if (planDesc.length) {
      message = `Improvement plan created: ${planDesc.join(', ')}`;
    } else {
      message = 'Improvement plan created';
    }

    this._createLog({ message });

    diff.isProcessed = true;
  }

  _improvementPlanReviewDatesChanged(diff) {
    const { ITEM_ADDED, ITEM_REMOVED } = this.constructor._changesTypes;

    const { field, kind, item: { date } = {} } = diff;
    if (!date) {
      return;
    }

    const prettyDate = this._getPrettyDate(date);

    let message;
    if (kind === ITEM_ADDED) {
      message = `Improvement plan review date added: ${prettyDate}`;
    } else if (kind === ITEM_REMOVED) {
      message = `Improvement plan review date removed: ${prettyDate}`;
    }

    if (message) {
      this._createLog({ message, field });
      diff.isProcessed = true;
    }
  }

  static get _fieldLabels() {
    const fieldLabels = {
      improvementPlan: 'Improvement plan',
      'improvementPlan.desiredOutcome': 'Improvement plan desired outcome',
      'improvementPlan.targetDate': 'Improvement plan target date for desired outcome',
      'improvementPlan.reviewDates': 'Improvement plan review dates',
      'improvementPlan.reviewDates.$.date': 'Improvement plan review date',
      'improvementPlan.owner': 'Improvement plan owner',
      'improvementPlan.files': 'Improvement plan files',
      'improvementPlan.files.$.name': 'Improvement plan file name',
      'improvementPlan.files.$.url': 'Improvement plan file url'
    };

    return _(fieldLabels).extend(super._fieldLabels);
  }

  static get _messages() {
    const { FIELD_ADDED, FIELD_CHANGED, FIELD_REMOVED } = this._changesTypes;

    const messages = {
      'improvementPlan.desiredOutcome': {
        [FIELD_ADDED]: 'Improvement plan desired outcome set',
        [FIELD_CHANGED]: 'Improvement plan desired outcome changed',
        [FIELD_REMOVED]: 'Improvement plan desired outcome removed'
      }
    };

    return _(messages).extend(super._messages);
  }

}
