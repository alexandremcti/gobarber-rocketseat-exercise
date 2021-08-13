import AppError from "@shared/errors/AppError";
import FakeUsersRepository from "@modules/users/repositories/fakes/FakeUsersRepository";
import SendForgotPasswordEmailService from "@modules/users/services/SendForgotPasswordEmailService";
import FakeMailProvider from "@shared/container/providers/MailProvider/fakes/FakeMailProvider";
import FakeUsersTokensRepository from "../repositories/fakes/FakeUserTokensRepository";

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUsersTokensRepository;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

describe("CreateUser", () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeMailProvider = new FakeMailProvider();
        fakeUserTokensRepository = new FakeUsersTokensRepository();

        sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
            fakeUsersRepository,
            fakeMailProvider,
            fakeUserTokensRepository,
        );
    });

    it("should be able to recover the password using the email", async () => {
        const sendMail = jest.spyOn(fakeMailProvider, "sendMail");

        await fakeUsersRepository.create({
            email: "alexandre@gmail.com.br",
            name: "alexandre",
            password: "123",
        });

        await sendForgotPasswordEmailService.execute({
            email: "alexandre@gmail.com.br",
        });

        expect(sendMail).toHaveBeenCalled();
    });

    it("should not be able to recover a non-existing user password", async () => {
        await expect(
            sendForgotPasswordEmailService.execute({
                email: "alexandre@gmail.com",
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should generated a forget password token", async () => {
        const generatedToken = jest.spyOn(fakeUserTokensRepository, "generate");

        const user = await fakeUsersRepository.create({
            email: "alexandre@gmail.com.br",
            name: "alexandre",
            password: "123",
        });

        await sendForgotPasswordEmailService.execute({
            email: "alexandre@gmail.com.br",
        });

        expect(generatedToken).toHaveBeenCalledWith(user.id);
    });
});
