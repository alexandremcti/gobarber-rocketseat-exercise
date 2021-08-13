/* eslint-disable prettier/prettier */
import { getHours, isAfter } from "date-fns";
import { inject, injectable } from "tsyringe";
import IAppointmentsRepository from "../repositories/IAppointmentsRepository";

interface IRequest {
    provider_id: string;
    month: number;
    year: number;
    day: number;
}

type IResponse = Array<{
    hour: number;
    available: boolean;
}>;

@injectable()
export default class ListProviderDayAvailabilityService {
    constructor(
        @inject("AppointmentsRepository")
        private appointmentsRepository: IAppointmentsRepository,
    ) { }

    public async execute({
        provider_id,
        month,
        year,
        day
    }: IRequest): Promise<IResponse> {
        const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
            {
                provider_id,
                month,
                year,
                day,
            },
        );

        console.log(appointments);

        const startHour = 8;

        const eachHourArray = Array.from(
            { length: 10 },
            (_, index) => index + startHour,
        );

        const currentHour = new Date(Date.now());

        const availability = eachHourArray.map(hour => {
            const appointmentsInHour = appointments.filter(appointment => {
                return getHours(appointment.date) === hour;
            });

            const compareDate = new Date(year, month - 1, day, hour)

            return {
                hour,
                available: !appointmentsInHour && isAfter(hour, currentHour),
            };
        });

        return availability;
    }
}
