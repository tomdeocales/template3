import type { NextFunction, Request, Response } from "express";

import morgan from "morgan";

const logFormat = ":date[iso] :method :url :status :response-time ms";

export function error() {
  return (err: Error, req: Request, res: Response, next: NextFunction) => {
    let logMessage = "";

    const morganErrorLogger = morgan(logFormat, {
      stream: {
        write: (message: string) => {
          logMessage = message.trim();
          console.error(logMessage);
        },
      },
      skip: (req, res) => res.statusCode < 400,
    });

    morganErrorLogger(req, res, () => {});

    const errorLog = {
      message: err.message,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode || 500,
      userAgent: req.get("User-Agent") || "Unknown",
      ip: req.ip || "Unknown",
      timestamp: new Date().toISOString(),
      morganLog: logMessage,
    };

    console.error("[ERROR]", errorLog);
    // TODO: save this to a file or to a db

    res.status(errorLog.status).json({
      message: "Internal Server Error",
    });

    next();
  };
}

// app.get('/api/v1/error-test', (req, res, next) => {
//   next(new Error('Something went wrong!'));
// });
