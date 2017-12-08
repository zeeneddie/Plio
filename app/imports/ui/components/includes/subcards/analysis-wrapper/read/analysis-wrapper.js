import { Template } from 'meteor/templating';
import { AnalysisTitles } from '/imports/api/constants.js';

Template.Subcards_AnalysisWrapper_Read.viewmodel({
  RCALabel: AnalysisTitles.rootCauseAnalysis,
<<<<<<< HEAD
  UOSLabel: 'Update of standard(s)',
=======
  UOSLabel: AnalysisTitles.updateOfStandards,
>>>>>>> d9bedfa586277a878b2e425b1cdf3771f9696b17
});
