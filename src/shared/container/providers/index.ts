import { container } from "tsyringe";

import IStorageProvider from "@shared/container/providers/StorageProvider/models/IStorageProvider";
import DiskStorageProvider from "@shared/container/providers/StorageProvider/implementations/DiskStorageProvider";

import IMailProvider from "@shared/container/providers/MailProvider/models/IMailProvider";
import EtherealMailProvider from "@shared/container/providers/MailProvider/implementations/EtherealMailProvider";

import IMailTemplateProvider from "@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider";
import MailTemplateProvider from "@shared/container/providers/MailTemplateProvider/implementations/HandlebarsMailTemplateProvider";

container.registerSingleton<IStorageProvider>(
    "StorageProvider",
    DiskStorageProvider,
);

container.registerInstance<IMailTemplateProvider>(
    "MailTemplateProvider",
    container.resolve(MailTemplateProvider),
);

container.registerInstance<IMailProvider>(
    "MailProvider",
    container.resolve(EtherealMailProvider),
);
