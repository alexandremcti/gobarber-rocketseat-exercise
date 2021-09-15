/* eslint-disable prettier/prettier */
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";
import { injectable, inject } from "tsyringe";

import Appointment from "../infra/typeorm/entities/Appointment";
import IAppointmentsRepository from "../repositories/IAppointmentsRepository";

interface IRequest {
    provider_id: string;
    day: number;
    month: number;
    year: number;
}

@injectable()
class ListProviderAppointmentsService {
    constructor(
        @inject("AppointmentsRepository")
        private appointmentsRepository: IAppointmentsRepository,

        @inject("CacheProvider")
        private cacheProvider: ICacheProvider,

    ) { }

    public async execute({
        provider_id,
        day,
        month,
        year,
    }: IRequest): Promise<Appointment[]> {
        const cachKey = `provider-appointments:${provider_id}:${year}-${month}-${day}`;

        let appointments = await this.cacheProvider.recover<Appointment[]>(
            cachKey
        )

        if (!appointments) {

            appointments = await this.appointmentsRepository.findAllInDayFromProvider(
                {
                    provider_id,
                    day,
                    month,
                    year,
                },
            );

            console.log('buscou no banco')

            await this.cacheProvider.save(cachKey, appointments);
        }

        return appointments;
    }
}

export default ListProviderAppointmentsService;
