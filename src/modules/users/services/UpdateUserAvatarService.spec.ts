import FakeStorageProvider from "@shared/container/providers/StorageProvider/fakes/FakeStorageProvider";
import AppError from "@shared/errors/AppError";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import UpdateUserAvatarService from "./UpdateUserAvatarService";

let fakeUserRepository: FakeUsersRepository;
let updateUserAvatarService: UpdateUserAvatarService;
let fakeStorageProvider: FakeStorageProvider;

describe("UpdateUserAvatar", () => {
    beforeEach(() => {
        fakeStorageProvider = new FakeStorageProvider();
        fakeUserRepository = new FakeUsersRepository();
        updateUserAvatarService = new UpdateUserAvatarService(
            fakeUserRepository,
            fakeStorageProvider,
        );
    });
    it("should be able update a user avatar", async () => {
        const user = await fakeUserRepository.create({
            email: "alexandre@gmail.com.br",
            name: "Alexandre",
            password: "123",
        });
        await updateUserAvatarService.execute({
            user_id: user.id,
            avatarFilename: "avatarFilename.jpg",
        });

        expect(user.avatar).toBe("avatarFilename.jpg");
    });

    it("should not be able update a user avatar from non existing user", async () => {
        await expect(
            updateUserAvatarService.execute({
                user_id: "no-existing-user",
                avatarFilename: "avatarFilename.jpg",
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able delete a user avatar", async () => {
        // espiona a função de uma classe
        const deleteFile = jest.spyOn(fakeStorageProvider, "deleteFile");

        const user = await fakeUserRepository.create({
            email: "alexandre@gmail.com.br",
            name: "Alexandre",
            password: "123",
        });
        await updateUserAvatarService.execute({
            user_id: user.id,
            avatarFilename: "avatarFilename.jpg",
        });

        await updateUserAvatarService.execute({
            user_id: user.id,
            avatarFilename: "avatarFilename2.jpg",
        });

        expect(deleteFile).toHaveBeenCalledWith("avatarFilename.jpg");
        expect(user.avatar).toBe("avatarFilename2.jpg");
    });
});
