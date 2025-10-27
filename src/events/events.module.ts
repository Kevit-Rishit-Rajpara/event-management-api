import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from './schemas/event.schema';
import { Registration, RegistrationSchema } from './schemas/registration.schema';
import { EventsService } from './services/events.service';
import { RegistrationService } from './services/registration.service';
import { EventsController } from './controllers/events.controller';

/**
 * Events Module
 * Manages events and registrations
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: Registration.name, schema: RegistrationSchema }
    ])
  ],
  providers: [EventsService, RegistrationService],
  controllers: [EventsController],
  exports: [EventsService, RegistrationService]
})
export class EventsModule {}
