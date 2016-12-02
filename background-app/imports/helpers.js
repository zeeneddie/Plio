import { ProblemTypes } from '/imports/share/constants';


export const getProblemName = problem => `${problem.sequentialId} "${problem.title}"`;

export const getProblemDescription = (problemType) => {
  return {
    [ProblemTypes.NON_CONFORMITY]: 'non-conformity',
    [ProblemTypes.RISK]: 'risk',
  }[problemType];
};

export const getProblemUrl = (problem, problemType, organization) => {
  const path = {
    [ProblemTypes.NON_CONFORMITY]: 'non-conformities',
    [ProblemTypes.RISK]: 'risks',
  }[problemType];

  return `${organization.serialNumber}/${path}/${problem._id}`;
};
