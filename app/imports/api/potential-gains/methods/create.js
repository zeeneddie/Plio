import { M } from '../../method';

export default new M({
  name: 'PG.insert',
  validate: null,
  middleware: [
    (next, args, context) => {
      console.log(context.userId); // SQHmBKJ94gJvpLKLt
      return next(args, { ...context, userId: 123 });
    },
    (next, args, context) => {
      console.log(context.userId); // 123
      return next(args, context);
    },
  ],
  run(args, context) {
    console.log(context.userId); // 123
  },
});
