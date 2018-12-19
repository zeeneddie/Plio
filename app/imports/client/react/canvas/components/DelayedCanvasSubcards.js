import delayed from '../../helpers/delayed';
import CanvasSubcards from './CanvasSubcards';

const DelayedCanvasSubcards = props => delayed({
  loader: () => Promise.resolve(CanvasSubcards),
  idle: true,
  delay: 250,
})(props);

export default DelayedCanvasSubcards;
