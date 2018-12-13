import { delayed } from 'libreact/lib/delayed';

const DelayedCanvasSubcards = props => delayed({
  loader: () => import('./CanvasSubcards'),
  idle: true,
  delay: 250,
})(props);

export default DelayedCanvasSubcards;
