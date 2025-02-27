import morgan from "morgan";

const logFormat = ":date[iso] :method :url :status :response-time ms";

export function logger() {
  return morgan(logFormat, {
    stream: {
      // eslint-disable-next-line no-console
      write: (message: string) => console.log(message.trim()),
    },
    skip: (req, res) => res.statusCode >= 400,
  });
}
