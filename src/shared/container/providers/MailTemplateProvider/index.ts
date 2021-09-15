import { container } from "tsyringe";

import IMailTemplateProvider from "@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider";
import MailTemplateProvider from "@shared/container/providers/MailTemplateProvider/implementations/HandlebarsMailTemplateProvider";

container.registerInstance<IMailTemplateProvider>(
    "MailTemplateProvider",
    container.resolve(MailTemplateProvider),
);
