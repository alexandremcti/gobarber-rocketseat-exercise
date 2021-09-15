import { Request, Response } from "express";
import { container } from "tsyringe";
import { classToClass } from "class-transformer";
import CreateUserService from "@modules/users/services/CreateUserService";

interface IUser {
    name: string;
    email: string;
    password?: string;
}

export default class UsersController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { name, email, password } = request.body;

        const createUserService = container.resolve(CreateUserService);

        const user: IUser = await createUserService.execute({
            name,
            email,
            password,
        });

        delete user.password;

        return response.json(classToClass(user));
    }
}
