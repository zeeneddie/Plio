import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-enzyme';

configure({ adapter: new Adapter() });

global.requestAnimationFrame = cb => cb(0);
global.window.cancelAnimationFrame = () => null;
