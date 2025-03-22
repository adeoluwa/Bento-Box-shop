import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import express, { Express } from 'express';
import createError from 'http-errors';
// import requestIp from 'request-ip';
import helmet from 'helmet';
import BaseRouter from '../../routes/v1/index';
import { logger } from '../utils/logger';

export const CreateServer = (): Express => {
  const app = express();
  const PORT = process.env.PORT || 8080;

  app.use(
    cors({
      origin: true,
      optionsSuccessStatus: 200,
      credentials: true,
    }),
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser(process.env.COOKIE_SECRET));

  // Show routes called in console during development
  if (process.env.NODE_ENV === 'development') {
    app.use(
      morgan(':method :status :url :res[content-length] - :response-time ms', {
        stream: {
          // Configure Morgan to use custom logger with the http severity.
          // FIXME: using the http severity prepends 'undefined' to the message
          write: (message) => console.info(message.trim()),
        },
      }),
    );
  }

  if (process.env.NODE_ENV === 'production') {
    app.use(helmet());

    // app.use(requestIp.mw({attributeName: ConstantSourceNode.REQUEST_ATTRIBUTES.IP_ADDRESS}));
  }
  // TODO: Add favicon

  app.get("/", (req,res, next) => {
    res.status(200).json({
      message:"Welcome"
    });

    return;
  });

  app.use('/api/v1', BaseRouter);

  app.use((req, res, next) => {
    next(createError(404));
  });

  app.listen(PORT, () =>
    logger.info(`backend server started on port http://localhost:${PORT}`),
  );

  return app;
};
