import { getRepository, Raw, Repository } from "typeorm";
import Appointment from "@modules/appointments/infra/typeorm/entities/Appointment";
import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";
import ICreateAppointmentDTO from "@modules/appointments/dtos/ICreateAppointmentDTO";
import IFindAllInMonthFromProviderDTO from "@modules/appointments/dtos/IFindAllInMonthFromProviderDTO";
import IFindAllInDayFromProviderDTO from "@modules/appointments/dtos/IFindAllInDayFromProviderDTO";

// Usando o IAppointmentsRepository e aplicando o Liskov Substitution Principle
// Estamos criando uma classe que implementa um contrato com IAppointmentsRepository
// Logo tudo que a abstração(IAppointmentsRepository) faz, essa classe concreta também fará
class AppointmentsRepository implements IAppointmentsRepository {
    private ormRepository: Repository<Appointment>;

    constructor() {
        this.ormRepository = getRepository(Appointment);
    }

    public async findAllInDayFromProvider({
        provider_id,
        month,
        day,
        year,
    }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
        const parsedDay = String(day).padStart(2, "0");
        const parsedMonth = String(month).padStart(2, "0");

        const appointments = await this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(
                    dateFieldName =>
                        `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
                ),
            },
            relations: ["user"],
        });

        return appointments;
    }

    public async findAllInMonthFromProvider({
        provider_id,
        month,
        year,
    }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
        const parsedMonth = String(month).padStart(2, "0");
        // O método Raw permite fazer pesquisas diretamente no BD sem passar pelo typeorm
        // dateFieldName é o nome do campo que está na tabela do BD
        // to_char é um método do bd postgres que converte uma data para string
        // código abaixo quer saber se o resultado da data que está sendo procurada, convertida para o formato MM-YYYY
        // é igual ao valor procurado em parsedMonth-year
        const appointments = await this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(
                    dateFieldName =>
                        `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
                ),
            },
        });

        return appointments;
    }

    // Ao criar uma função async o retorno sempre será uma Promise
    public async findByDate(
        date: Date,
        provider_id: string,
    ): Promise<Appointment | undefined> {
        const findAppointment = await this.ormRepository.findOne({
            where: { date, provider_id },
        });

        return findAppointment;
    }

    public async create({
        date,
        provider_id,
        user_id,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = this.ormRepository.create({
            date,
            provider_id,
            user_id,
        });

        await this.ormRepository.save(appointment);

        return appointment;
    }
}

export default AppointmentsRepository;
