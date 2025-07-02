import { Request, Response, NextFunction } from "express";

export function authWithSession(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if ((req.session as any)?.user && req.session) {
    console.log("User is authenticated", (req.session as any)?.user.id);
    return next();
  }

  console.log("User is not authenticated", req.sessionID);
  res.status(401).send({ error: "Unauthorized", authenticated: false });
}
