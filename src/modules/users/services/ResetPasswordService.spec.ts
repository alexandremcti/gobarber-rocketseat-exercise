import FakeUsersRepository from "@modules/users/repositories/fakes/FakeUsersRepository";
import ResetPasswordService from "@modules/users/services/ResetPasswordService";

import FakeHashProvider from "@modules/users/providers/HashProvider/fakes/FakeHashProvider";
import AppError from "@shared/errors/AppError";
import FakeUserTokensRepository from "../repositories/fakes/FakeUserTokensRepository";

let fakeUsersRepository: FakeUsersRepository;

let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe("ResetPasswordService", () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        fakeHashProvider = new FakeHashProvider();

        resetPasswordService = new ResetPasswordService(
            fakeUsersRepository,
            fakeUserTokensRepository,
            fakeHashProvider,
        );
    });

    it("should be able to reset the password", async () => {
        const user = await fakeUsersRepository.create({
            name: "Alexandre",
            email: "alexandre@gmail.com.br",
            password: "123",
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        await resetPasswordService.execute({
            password: "123123",
            token,
        });

        const updatedUser = await fakeUsersRepository.findById(user.id);

        expect(updatedUser?.password).toBe("123123");
    });

    it("should be able generate password hash for user", async () => {
        const generateHash = jest.spyOn(fakeHashProvider, "generateHash");

        const user = await fakeUsersRepository.create({
            name: "Alexandre",
            email: "alexandre@gmail.com.br",
            password: "123",
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        await resetPasswordService.execute({
            password: "123123",
            token,
        });

        const updatedUser = await fakeUsersRepository.findById(user.id);

        expect(generateHash).toHaveBeenCalledWith("123123");
    });

    it("should not be able to reset the password with non-existing token", async () => {
        expect(
            resetPasswordService.execute({
                token: "no-existing-token",
                password: "123456",
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to reset the password with non-existing user", async () => {
        const { token } = await fakeUserTokensRepository.generate(
            "no-existing-user",
        );

        expect(
            resetPasswordService.execute({
                token,
                password: "123456",
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to reset the password if passed more than 2 hours", async () => {
        const user = await fakeUsersRepository.create({
            name: "Alexandre",
            email: "alexandre@gmail.com.br",
            password: "123",
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        jest.spyOn(Date, "now").mockImplementationOnce(() => {
            const customDate = new Date();

            return customDate.setHours(customDate.getHours() + 3);
        });

        await expect(
            resetPasswordService.execute({
                password: "123123",
                token,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
