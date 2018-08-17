import moment from 'moment-timezone';
import { ActionIndexes, WorkflowTypes } from '../../../constants';

describe('getActionStatus', () => {
  const timezone = moment.tz.guess();

  describe('three step', () => {
    it('returns correct status if action is completed', () => {
      const getActionStatus = require('../getActionStatus').default;
      const action = { isCompleted: true };

      expect(getActionStatus(timezone, action)).toBe(ActionIndexes.COMPLETED);
    });
  });

  describe('six step', () => {
    it('returns correct status for verified action', () => {
      jest.resetModules();
      jest.doMock('../getActionWorkflowType', jest.fn(() => () => WorkflowTypes.SIX_STEP));
      const getActionStatus = require('../getActionStatus').default;
      const action = { isCompleted: true, isVerified: true, isVerifiedAsEffective: true };

      expect(getActionStatus(timezone, action)).toBe(ActionIndexes.COMPLETED_EFFECTIVE);
    });
  });
});
