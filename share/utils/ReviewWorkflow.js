import moment from 'moment-timezone';

import { Reviews } from '../collections/reviews';
import { reviewConfigSchema } from '../schemas/organization-schema';


class ReviewWorkflow {

  constructor(doc, reviewConfig, timezone = 'UTC') {
    if (!doc) {
      throw new Error('Document is required');
    }

    try {
      reviewConfigSchema.validate(reviewConfig);
    } catch (err) {
      throw new Error(`Review config is not valid: ${err}`);
    }

    this.doc = doc;
    this.reviewConfig = reviewConfig;
    this.timezone = timezone;

    this._date = moment()
      .tz(this.timezone)
      .startOf('day')
      .toDate();
  }

  getReviewSchedule() {
    const nextSchedule = this._getNextSchedule();

    const { timeValue, timeUnit } = this.reviewConfig.frequency;
    const futureSchedule = moment(nextSchedule)
      .add(timeValue, timeUnit)
      .toDate();

    if (this._isRelatedToSchedule(futureSchedule)) {
      return futureSchedule;
    }

    return nextSchedule;
  }

  getStatus() {
    const nextReviewSchedule = this.getReviewSchedule();

    if (this._isRelatedToSchedule(nextReviewSchedule)) {
      return 1; // Awaiting review
    } else if (moment(this._date).isBefore(nextReviewSchedule)) {
      return 2; // Up-to-date
    }

    return 0; // Overdue
  }

  _getStartDate() {
    return moment.tz([
      this.doc.createdAt.getFullYear(),
      this.reviewConfig.annualDate.getMonth(),
      this.reviewConfig.annualDate.getDate(),
    ], this.timezone).toDate();
  }

  _getLastReview() {
    return Reviews.findOne({
      documentId: this.doc._id,
    }, {
      sort: { scheduledDate: -1 },
    });
  }

  _getLastReviewSchedule() {
    const lastReview = this._getLastReview();
    return lastReview && lastReview.scheduledDate;
  }

  _getPassedPeriods(startDate, endDate) {
    const { timeValue, timeUnit } = this.reviewConfig.frequency;
    const diff = moment(endDate).diff(startDate, timeUnit);
    return diff - (diff % timeValue);
  }

  _getNextSchedule() {
    const startDate = this._getStartDate();
    const {
      timeValue: frequencyTimeValue,
      timeUnit: frequencyTimeUnit,
    } = this.reviewConfig.frequency;

    let lastSchedule = this._getLastReviewSchedule() || startDate;
    lastSchedule = moment(lastSchedule)
      .add(frequencyTimeValue, frequencyTimeUnit)
      .toDate();

    const passedFromStartDate = this._getPassedPeriods(startDate, lastSchedule);
    let nextSchedule = moment(startDate)
      .add(passedFromStartDate, frequencyTimeUnit)
      .toDate();

    if (moment(nextSchedule).isSameOrAfter(this._date)) {
      return nextSchedule;
    }

    const passedFromSchedule = this._getPassedPeriods(nextSchedule, this._date);
    nextSchedule = moment(nextSchedule)
      .add(passedFromSchedule, frequencyTimeUnit)
      .toDate();

    return nextSchedule;
  }

  _isRelatedToSchedule(schedule) {
    const { start, until } = this.reviewConfig.reminders;

    const reminderStart = moment(schedule)
      .subtract(start.timeValue, start.timeUnit)
      .toDate();

    const reminderEnd = moment(schedule)
      .add(until.timeValue, until.timeUnit)
      .toDate();

    return moment().isSameOrAfter(reminderStart)
      && moment().isSameOrBefore(reminderEnd);
  }

}

export default ReviewWorkflow;
