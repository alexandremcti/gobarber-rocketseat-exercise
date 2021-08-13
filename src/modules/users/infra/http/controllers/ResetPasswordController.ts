import { container } from "tsyringe";
import { Request, Response } from "express";
import ResetPasswordControler from "@modules/users/services/ResetPasswordService";

export default class ResetPasswordController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { password, token } = request.body;

        const resetPasswordControler = container.resolve(
            ResetPasswordControler,
        );

        await resetPasswordControler.execute({
            password,
            token,
        });

        return response.status(204).json();
    }
}
