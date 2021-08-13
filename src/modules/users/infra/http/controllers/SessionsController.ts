import { container } from "tsyringe";
import { Request, Response } from "express";
import AuthenticateUserService from "@modules/users/services/AuthenticateUserService";

interface IUserSession {
    email: string;
    password?: string;
}

export default class SessionsController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { email, password } = request.body;

        const authenticateUserService = container.resolve(
            AuthenticateUserService,
        );

        const { user, token } = await authenticateUserService.execute({
            email,
            password,
        });

        const iUserSession: IUserSession = user;

        delete iUserSession.password;

        return response.json({ user, token });
    }
}
