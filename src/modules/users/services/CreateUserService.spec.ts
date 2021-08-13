import AppError from "@shared/errors/AppError";
import FakeUsersRepository from "@modules/users/repositories/fakes/FakeUsersRepository";
import FakeHashProvider from "@modules/users/providers/HashProvider/fakes/FakeHashProvider";
import CreateUserService from "./CreateUserService";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;

describe("CreateUser", () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        createUserService = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });
    it("should be able to create a new user", async () => {
        const user = await createUserService.execute({
            email: "alexandre@gmail.com.br",
            name: "alexandre",
            password: "123456",
        });

        expect(user).toHaveProperty("id");
        expect(user).toHaveProperty("name");
        expect(user).toHaveProperty("password");
    });

    it("should not be able to create two users as same email", async () => {
        await createUserService.execute({
            email: "alexandre@gmail.com.br",
            name: "alexandre",
            password: "123456",
        });

        await expect(
            createUserService.execute({
                email: "alexandre@gmail.com.br",
                name: "alexandre",
                password: "123456",
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
