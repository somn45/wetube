import express from 'express';
import morgan from 'morgan';
import './db.js';
import rootRouter from './router/rootRouter.js';
import userRouter from './router/userRouter.js';
import videoRouter from './router/videoRouter.js';
const app = express();
const PORT = 4000;

app.set('view engine', 'pug');
app.set('views', process.cwd() + '/src/views');
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use('/', rootRouter);
app.use('/users', userRouter);
app.use('/videos', videoRouter);

app.listen(PORT, () => {
  console.log('Server Connect is success ✅');
});
