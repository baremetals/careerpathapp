import { Request, Response } from 'express';

export const rootHandler = async (_req: Request, res: Response) => {
  res.send(`
        "<html>"
        "<body style='padding: 10px;'>"
        "<h1>Welcome to the API</h1>"
        "<div>"
        "Check the docs: <a href='/api-docs'>here</a>"
        "</div>"
        "</body>"
        "</html>"
  `);
};
