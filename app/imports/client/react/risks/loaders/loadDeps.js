import { batchActions } from 'redux-batched-actions';

import { BackgroundSubs } from '../../../../startup/client/subsmanagers';
import {
  Departments,
  NonConformities,
  Risks,
  Actions,
  Standards,
  WorkItems,
  Files,
  Projects,
  LessonsLearned,
} from '../../../../share/collections';
import {
  setDepartments,
  setNCs,
  setRisks,
  setActions,
  setStandards,
  setWorkItems,
  setLessons,
  setFiles,
  setProjects,
} from '../../../../client/store/actions/collectionsActions';
import { setDepsReady } from '../../../../client/store/actions/risksActions';

export default function loadDeps({ dispatch, organizationId, initializing }, onData) {
  const subscription = BackgroundSubs.subscribe('risksDeps', organizationId);

  if (subscription.ready()) {
    const query = { organizationId };
    const pOptions = { sort: { serialNumber: 1 } };
    const departments = Departments.find(query, { sort: { name: 1 } }).fetch();
    const projects = Projects.find(query, { sort: { title: 1 } }).fetch();
    const ncs = NonConformities.find(query, pOptions).fetch();
    const standards = Standards.find(query, pOptions).fetch();
    const actions = Actions.find(query, pOptions).fetch();
    const lessons = LessonsLearned.find(query, pOptions).fetch();
    const workItems = WorkItems.find(query).fetch();
    const files = Files.find(query, { sort: { updatedAt: -1 } }).fetch();

    let reduxActions = [
      setDepartments(departments),
      setNCs(ncs),
      setStandards(standards),
      setActions(actions),
      setWorkItems(workItems),
      setLessons(lessons),
      setFiles(files),
      setProjects(projects),
      setDepsReady(true),
    ];

    if (initializing) {
      // set risks only when initializing because
      // later observers will be running
      const risks = Risks.find(query, { sort: { title: 1 } }).fetch();

      reduxActions = reduxActions.concat(setRisks(risks));
    }

    dispatch(batchActions(reduxActions));
  }

  onData(null, {});
}
