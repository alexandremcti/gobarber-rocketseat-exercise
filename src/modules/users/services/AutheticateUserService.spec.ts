import "dotenv/config";
import AppError from "@shared/errors/AppError";
import FakeUsersRepository from "@modules/users/repositories/fakes/FakeUsersRepository";
import FakeHashProvider from "@modules/users/providers/HashProvider/fakes/FakeHashProvider";
import AuthenticateUserService from "./AuthenticateUserService";
import CreateUserService from "./CreateUserService";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUserService: AuthenticateUserService;
let createUserService: CreateUserService;

describe("AuthenticateUser", () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        authenticateUserService = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
        createUserService = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });
    it("should be able to authenticate", async () => {
        await createUserService.execute({
            email: "alexandre@gmail.com.br",
            name: "alexandre",
            password: "123456",
        });

        const userAuthenticated = await authenticateUserService.execute({
            email: "alexandre@gmail.com.br",
            password: "123456",
        });

        expect(userAuthenticated).toHaveProperty("token");
    });

    it("should not be able to authenticate as incorrect email", async () => {
        await createUserService.execute({
            email: "alexandre@gmail.com.br",
            name: "alexandre",
            password: "123456",
        });

        await expect(
            authenticateUserService.execute({
                email: "alexandre@gmail.com.",
                password: "123456",
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to authenticate as incorrect password", async () => {
        await createUserService.execute({
            email: "alexandre@gmail.com.br",
            name: "alexandre",
            password: "123456",
        });

        await expect(
            authenticateUserService.execute({
                email: "alexandre@gmail.com.br",
                password: "1234567",
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
