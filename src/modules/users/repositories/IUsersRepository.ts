import ICreateUserDTO from "../dtos/ICreateUserDTO";
import IFindAllProviderDTO from "../dtos/IFindAllProvidersDTO";
import User from "../infra/typeorm/entities/User";

export default interface IUsersRepository {
    findById(id: string): Promise<User | undefined>;
    findByEmail(email: string): Promise<User | undefined>;
    create(data: ICreateUserDTO): Promise<User>;
    save(user: User): Promise<User>;
    findAllProviders(data: IFindAllProviderDTO): Promise<User[]>;
}
