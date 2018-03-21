jest.mock('../../membership/isOrgOwner', () => jest.fn(() => false));

describe('isAnalysisOwner', () => {
  it('fails', () => {
    const isAnalysisOwner = require('../isAnalysisOwner').default;
    const userId = 1;
    const o = {
      organizationId: 2,
      analysis: {
        completedBy: 3,
      },
    };

    expect(isAnalysisOwner(o, userId)).toBe(false);
  });

  it('passes if userId equals completedBy', () => {
    const isAnalysisOwner = require('../isAnalysisOwner').default;

    const completedBy = 1;
    const o = {
      analysis: {
        completedBy,
      },
    };

    expect(isAnalysisOwner(o, completedBy)).toBe(true);
  });

  it('passes if user is org owner', async () => {
    jest.resetModules();
    jest.doMock('../../membership/isOrgOwner', () => jest.fn(() => true));
    const isAnalysisOwner = require('../isAnalysisOwner').default;

    const userId = 3;
    const o = {
      organizationId: 1,
      analysis: {
        completedBy: 2,
      },
    };

    expect(isAnalysisOwner(o, userId)).toBe(true);
  });
});
