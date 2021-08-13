import { container } from "tsyringe";
import { Request, Response } from "express";
import SendForgotPassowrdEmailService from "@modules/users/services/SendForgotPasswordEmailService";

export default class ForgotPasswordController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { email } = request.body;

        const sendForgotPassowrdEmailService = container.resolve(
            SendForgotPassowrdEmailService,
        );

        await sendForgotPassowrdEmailService.execute({
            email,
        });

        return response.status(204).json();
    }
}
