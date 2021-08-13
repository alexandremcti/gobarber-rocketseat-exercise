import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentsRepository";
import ListProviderDayAvailabilityService from "./ListProviderDayAvailabilityService";

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailabilityService: ListProviderDayAvailabilityService;

describe("ListProviderDayAvailability", () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderDayAvailabilityService = new ListProviderDayAvailabilityService(
            fakeAppointmentsRepository,
        );
    });

    it("should be able to list the Day availability from provider", async () => {
        await fakeAppointmentsRepository.create({
            provider_id: "user",
            date: new Date(2021, 4, 21, 15, 0, 0),
            user_id: "user",
        });

        await fakeAppointmentsRepository.create({
            provider_id: "user",
            date: new Date(2021, 4, 21, 16, 0, 0),
            user_id: "user",
        });

        jest.spyOn(Date, "now").mockImplementationOnce(() => {
            return new Date(2021, 4, 20, 11).getTime();
        });

        const availability = await listProviderDayAvailabilityService.execute({
            provider_id: "user",
            year: 2021,
            month: 5,
            day: 21,
        });

        expect.arrayContaining([
            { hour: 8, available: false },
            { hour: 9, available: false },
            { hour: 10, available: false },
            { hour: 11, available: false },
            { hour: 12, available: true },
            { hour: 13, available: true },
            { hour: 15, available: false },
            { hour: 16, available: false },
        ]);
    });
});
