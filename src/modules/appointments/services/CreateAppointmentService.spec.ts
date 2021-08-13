import AppError from "@shared/errors/AppError";
import FakeNotificationsRepository from "@modules/notifications/repositories/fakes/FakeNotificationsRepository";
import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentsRepository";
import CreateAppointmentService from "./CreateAppointmentService";

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentService;
let fakeNotificationsRepository: FakeNotificationsRepository;

describe("CreateAppointment", () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeNotificationsRepository = new FakeNotificationsRepository();
        createAppointmentService = new CreateAppointmentService(
            fakeAppointmentsRepository,
            fakeNotificationsRepository,
        );
    });

    it("should be able to create a new appointment", async () => {
        jest.spyOn(Date, "now").mockImplementationOnce(() => {
            return new Date(2021, 4, 10, 12).getTime();
        });

        const appointment = await createAppointmentService.execute({
            date: new Date(2021, 4, 10, 13),
            provider_id: "provider_id",
            user_id: "user_id",
        });

        expect(appointment).toHaveProperty("id");
        expect(appointment).toHaveProperty("date");
    });

    it("should not be able to create two appointments in same time", async () => {
        jest.spyOn(Date, "now").mockImplementation(() => {
            return new Date(2020, 4, 10, 10).getTime();
        });

        const appointmentDate = new Date(2021, 4, 10, 11);
        await createAppointmentService.execute({
            date: appointmentDate,
            provider_id: "provider_id",
            user_id: "user_id",
        });

        await expect(
            createAppointmentService.execute({
                date: appointmentDate,
                provider_id: "provider_id",
                user_id: "user_id",
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to create an appointment on a past date", async () => {
        jest.spyOn(Date, "now").mockImplementationOnce(() => {
            return new Date(2021, 4, 10, 12).getTime();
        });

        await expect(
            createAppointmentService.execute({
                date: new Date(2021, 4, 10, 11),
                provider_id: "provider-id",
                user_id: "user-id",
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to create an appointment with same user as provider", async () => {
        jest.spyOn(Date, "now").mockImplementationOnce(() => {
            return new Date(2021, 4, 10, 12).getTime();
        });

        await expect(
            createAppointmentService.execute({
                date: new Date(2021, 4, 10, 13),
                provider_id: "user-id",
                user_id: "user-id",
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to create an appointment before 8am and after 5pm", async () => {
        jest.spyOn(Date, "now").mockImplementationOnce(() => {
            return new Date(2021, 4, 10, 12).getTime();
        });

        await expect(
            createAppointmentService.execute({
                date: new Date(2021, 4, 11, 7),
                provider_id: "user-id",
                user_id: "provider-id",
            }),
        ).rejects.toBeInstanceOf(AppError);

        await expect(
            createAppointmentService.execute({
                date: new Date(2021, 4, 11, 18),
                provider_id: "user-id",
                user_id: "provider-id",
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
