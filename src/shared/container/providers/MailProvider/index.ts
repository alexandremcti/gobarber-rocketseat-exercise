import { container } from "tsyringe";

import IMailProvider from "@shared/container/providers/MailProvider/models/IMailProvider";
import EtherealMailProvider from "@shared/container/providers/MailProvider/implementations/EtherealMailProvider";

container.registerInstance<IMailProvider>(
    "MailProvider",
    container.resolve(EtherealMailProvider),
);
