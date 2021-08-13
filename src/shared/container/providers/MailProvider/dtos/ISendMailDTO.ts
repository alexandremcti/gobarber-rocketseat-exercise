import IParseMailTemplateDTO from "../../MailTemplateProvider/dtos/IParseMailTemplateDTO";

interface IMailContact {
    name: string;
    email: string;
}

export default interface ISendMailDTO {
    from?: IMailContact;
    to: IMailContact;
    subject: string;
    templateData: IParseMailTemplateDTO;
}
