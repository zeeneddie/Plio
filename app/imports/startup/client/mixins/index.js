import { ViewModel } from 'meteor/manuel:viewmodel';

import vmTraverse from './vmTraverse';
import getChildrenData from './getChildrenData';
import notifications from './notifications';
import modal from './modal';
import actionStatus from './actionStatus';
import addForm from './addForm';
import callWithFocusCheck from './callWithFocusCheck';
import collapse from './collapse';
import collapsing from './collapsing';
import counter from './counter';
import currency from './currency';
import date from './date';
import department from './department';
import discussions from './discussions';
import filters from './filters';
import iframe from './iframe';
import index from '.';
import magnitude from './magnitude';
import members from './members';
import messages from './messages';
import mobile from './mobile';
import nonconformity from './nonconformity';
import numberRegex from './numberRegex';
import organization from './organization';
import problemsStatus from './problemsStatus';
import reviewStatus from './reviewStatus';
import risk from './risk';
import riskScore from './riskScore';
import roles from './roles';
import router from './router';
import search from './search';
import standard from './standard';
import uploader from './uploader';
import urlRegex from './urlRegex';
import user from './user';
import userEdit from './userEdit';
import utils from './utils';
import workInbox from './workInbox';
import workItemStatus from './workItemStatus';
import documentStatus from './documentStatus';
import store from './store';

ViewModel.mixin({
  documentStatus,
  actionStatus,
  addForm,
  callWithFocusCheck,
  collapse,
  collapsing,
  counter,
  currency,
  date,
  department,
  discussions,
  filters,
  getChildrenData,
  iframe,
  index,
  magnitude,
  members,
  messages,
  mobile,
  modal,
  nonconformity,
  notifications,
  numberRegex,
  organization,
  problemsStatus,
  reviewStatus,
  risk,
  riskScore,
  roles,
  router,
  search,
  standard,
  uploader,
  urlRegex,
  user,
  userEdit,
  utils,
  workInbox,
  workItemStatus,
  vmTraverse,
  store,
});

ViewModel.persist = false;
