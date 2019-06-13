import { Styles } from '../../../../api/constants';

export const ChartDefaultOptions = {
  LAYOUT: {
    padding: {
      top: 16,
      right: 16,
      bottom: 0,
      left: 16,
    },
  },
  LEGEND: {
    position: 'bottom',
    labels: {
      usePointStyle: true,
      padding: 20,
      fontFamily: Styles.font.family.segoe.regular,
    },
  },
  TITLE: {
    fontSize: 20,
    fontColor: Styles.color.darkGrey,
  },
  POINT: {
    radius: 10,
    borderWidth: 0,
    hoverRadius: 2,
  },
  ARC: {
    borderWidth: 0,
  },
};

export const BubbleDefaultOptions = {
  SCALE_LABEL_SIZE: 17,
  X_TOOLTIP_LABEL: 'x',
  Y_TOOLTIP_LABEL: 'y',
  TICKS: {
    suggestedMin: 0,
    suggestedMax: 100,
  },
};
