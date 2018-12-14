import { delayed } from '../../helpers';
import CanvasSubcards from './CanvasSubcards';

const DelayedCanvasSubcards = props => delayed({
  loader: () => CanvasSubcards,
  idle: true,
  delay: 250,
})(props);

export default DelayedCanvasSubcards;
