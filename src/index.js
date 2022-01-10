import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import MongoStore from 'connect-mongo';

/* 모듈 불러오기 */
import './db.js';
import rootRouter from './router/rootRouter.js';
import userRouter from './router/userRouter.js';
import videoRouter from './router/videoRouter.js';
import { localsMiddleware } from './middleware/localsMiddleware.js';
const app = express();
const PORT = 4000;

app.set('view engine', 'pug');
app.set('views', process.cwd() + '/src/views');

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'hello',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 604800000,
    },
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);
app.use(localsMiddleware);
app.use('/', rootRouter);
app.use('/users', userRouter);
app.use('/videos', videoRouter);

app.listen(PORT, () => {
  console.log('Server Connect is success ✅');
});
