import { noop } from 'plio-util';
import ReactDOM from 'react-dom';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { FlowRouter } from 'meteor/kadira:flow-router';

const getRoute = path => path.match(/([A-Za-z-]+)/g) || [];

// Compatibility layer between React and Blaze
// because they conflict with each other
FlowRouter.triggers.enter([
  (context) => {
    const { route: { path } = {} } = context;
    const { oldRoute: { path: prevPath } = {} } = context;

    if (prevPath) {
      const [prevBase, prevRoute] = getRoute(prevPath);
      const [base, route] = getRoute(path);

      switch (prevRoute || prevBase) {
        // redirect from react to blaze
        case 'standards':
        case 'risks':
        case 'canvas':
        case 'orgSerialNumber':
          switch (route || base) {
            case 'work-inbox':
            case 'non-conformities':
            case 'users':
            case 'login':
            case 'hello':
            case 'sign-out':
              ReactDOM.unmountComponentAtNode(document.getElementById('app'));
              BlazeLayout.reset();
              break;
            default: noop();
          }
          break;
        // redirect from blaze to react
        case 'work-inbox':
        case 'hello':
        case 'users':
        case 'login':
        case 'sign-up':
        case 'verify-email':
        case 'forgot-password':
        case 'reset-password':
        case 'user-waiting':
          switch (route || base) {
            case 'standards':
            case 'risks':
            case 'non-conformities':
            case 'canvas':
            case 'orgSerialNumber':
              BlazeLayout.reset();
              break;
            default: noop();
          }
          break;
        default: noop();
      }
    }
  },
]);
