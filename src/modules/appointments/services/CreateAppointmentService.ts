/* eslint-disable prettier/prettier */
import { startOfHour, isBefore, getHours, format } from "date-fns";
import { injectable, inject } from "tsyringe";
import Appointment from "@modules/appointments/infra/typeorm/entities/Appointment";
import AppError from "@shared/errors/AppError";
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";
import IAppointmentsRepository from "../repositories/IAppointmentsRepository";

// Quando criamos interfaces dentro de services que serão usadas como parâmetros de um método execute
// Chamamos o nome de Request (convenção de nomes da Rocketseat)
interface IRequest {
    date: Date;
    provider_id: string;
    user_id: string;
}

@injectable()
class CreateAppointmentService {
    // Usando o Injection Dependency
    constructor(
        @inject("AppointmentsRepository")
        private appointmentsRepository: IAppointmentsRepository,

        @inject('NotificationsRepository')
        private notificationsRepository: INotificationsRepository,

        @inject("CacheProvider")
        private cacheProvider: ICacheProvider,
    ) { }

    public async execute({
        date,
        provider_id,
        user_id
    }: IRequest): Promise<Appointment> {
        const appointmentDate = startOfHour(date);

        if (isBefore(appointmentDate, Date.now())) {
            throw new AppError("You can't create an appointment on a past date.");
        }

        if (user_id === provider_id) {
            throw new AppError("You can't create an appointment with yourself.");
        }

        if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
            throw new AppError(
                'You can only create appontments between 8am and 5pm.',
            );
        }

        const findAppointmentInsSameDate = await this.appointmentsRepository.findByDate(
            appointmentDate,
            provider_id,
        );

        if (findAppointmentInsSameDate) {
            throw new AppError("This appointment is already booked");
        }

        const appointment = await this.appointmentsRepository.create({
            provider_id,
            user_id,
            date: appointmentDate,
        });

        const dateFormatted = format(appointment.date, "dd/MM/yyyy 'às' HH:mm'h'");

        await this.notificationsRepository.create({
            recipient_id: provider_id,
            content: `Novo agendamento para dia ${dateFormatted}`,
        });

        await this.cacheProvider.invalidate(
            `provider-appointments:${provider_id}:${format(appointment.date, "yyyy-m-d")}`
        )

        return appointment;
    }
}

export default CreateAppointmentService;
