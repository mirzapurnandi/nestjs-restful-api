import { ContactService } from '../contact/contact.service';
import { AddressValidation } from './address.validation';
import {
  CreateAddressRequest,
  AddressResponse,
  GetAddressRequest,
} from '../model/address.model';
import { Address, User } from '@prisma/client';
import { ValidationService } from '../common/validation.service';
import { PrismaService } from '../common/prisma.service';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class AddressService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
    private contactService: ContactService,
  ) {}

  async create(
    user: User,
    request: CreateAddressRequest,
  ): Promise<AddressResponse> {
    this.logger.debug(`AddressService.create(${JSON.stringify(request)})`);
    const createRequest: CreateAddressRequest = this.validationService.validate(
      AddressValidation.CREATE,
      request,
    );

    await this.contactService.checkContactMustExists(
      user.username,
      createRequest.contact_id,
    );

    const address = await this.prismaService.address.create({
      data: createRequest,
    });

    return this.toContactResponse(address);
  }

  toContactResponse(address: Address): AddressResponse {
    return {
      id: address.id,
      street: address.street,
      city: address.city,
      province: address.province,
      country: address.country,
      postal_code: address.postal_code,
    };
  }

  async get(user: User, request: GetAddressRequest): Promise<AddressResponse> {
    const getRequest: GetAddressRequest = this.validationService.validate(
      AddressValidation.GET,
      request,
    );

    await this.contactService.checkContactMustExists(
      user.username,
      getRequest.contact_id,
    );

    const address = await this.prismaService.address.findFirst({
      where: {
        id: getRequest.address_id,
        contact_id: getRequest.contact_id,
      },
    });

    if (!address) {
      throw new HttpException('Address is not Found', 404);
    }

    return this.toContactResponse(address);
  }
}
