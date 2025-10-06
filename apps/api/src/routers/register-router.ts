import { Router, Request, Response } from "express"
import { UserService } from "../services/user-service";
import { JwtService } from "../services/jwt-service";

const jwtService = new JwtService();
const userService = new UserService();

export const registerRouter = Router();

registerRouter.post('/', async (req: Request, res: Response) => {
  try {
    const userFromRequest = req.body;
    const userCreated = await userService.createUser(userFromRequest);

    const accessToken = await jwtService.generateJsonWebAccessToken(userCreated);
    const refreshToken = await jwtService.generateJsonWebRefreshToken(userCreated);
    res.status(201).json({ ok: true, data: { accessToken, refreshToken } }); 
  } catch (error) {
    res.status(500).json({ error: (error as any).message })
  }
});