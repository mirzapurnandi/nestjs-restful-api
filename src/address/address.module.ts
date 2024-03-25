import { ContactModule } from './../contact/contact.module';
import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';

@Module({
  imports: [ContactModule],
  providers: [AddressService],
  controllers: [AddressController],
})
export class AddressModule {}
