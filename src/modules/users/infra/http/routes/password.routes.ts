import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";

import ForgotPasswordController from "../controllers/ForgotPasswordController";
import ResetPasswordControler from "../controllers/ResetPasswordController";

const passwordRouter = Router();
const forgotPasswordController = new ForgotPasswordController();
const resetPasswordControler = new ResetPasswordControler();

passwordRouter.post(
    "/forgot",
    celebrate({
        [Segments.BODY]: {
            email: Joi.string().email().required(),
        },
    }),
    forgotPasswordController.create,
);
passwordRouter.post(
    "/reset",
    celebrate({
        [Segments.BODY]: {
            token: Joi.string().uuid().required(),
            password: Joi.string().required(),
            password_confirmation: Joi.string().valid(Joi.ref("password")),
        },
    }),
    resetPasswordControler.create,
);

export default passwordRouter;
