import express, { Request, Response, NextFunction } from "express";
import "dotenv/config";
import "express-async-errors";
import "reflect-metadata";

import routes from "@shared/infra/http/routes";

// Basta importar o local do arquivo
// uma vez que não existe nenhum export de função para uso externo
import "@shared/infra/typeorm";
import "@shared/container";
import uploadConfig from "@config/upload";
import AppError from "@shared/errors/AppError";
import { errors } from "celebrate";

const app = express();

app.use(express.json());
app.use("/files", express.static(uploadConfig.uploadFolder));
app.use(routes);
app.use(errors());
app.use(
    (
        error: Error,
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        if (error instanceof AppError) {
            return response
                .status(error.statusCode)
                .json({ status: "error", message: error.message });
        }
        console.error(error);
        return response.status(500).json({
            status: "error",
            message: "internal server error",
        });
    },
);

app.listen(3333, () => {
    console.log("server started on port 3333");
});
