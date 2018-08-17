import { Template } from 'meteor/templating';
import { AnalysisTitles } from '/imports/api/constants';

Template.Subcards_AnalysisWrapper_Read.viewmodel({
  RCALabel: AnalysisTitles.rootCauseAnalysis,
  UOSLabel: AnalysisTitles.updateOfStandards,
});
