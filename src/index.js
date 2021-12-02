import express from 'express';
import morgan from 'morgan';
import rootRouter from './router/rootRouter.js';
import userRouter from './router/userRouter.js';
import videoRouter from './router/videoRouter.js';
const app = express();
const PORT = 4000;

app.use(morgan('dev'));
app.use('/', rootRouter);
app.use('/users', userRouter);
app.use('/videos', videoRouter);

app.listen(PORT, () => {
  console.log('Server Connect is success ✅');
});
