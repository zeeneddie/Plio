import { view } from 'ramda';
import { lenses } from 'plio-util';

export const getLessons = view(lenses.collections.lessons);

export const getLessonsByIds = view(lenses.collections.lessonsByIds);
