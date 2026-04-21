import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';

export class UpdateAppointmentDto {
  @IsOptional() @IsString()  employeeId?: string;
  @IsOptional() @IsString()  serviceId?: string;
  @IsOptional() @IsNumber()  priceCharged?: number;
  @IsOptional() @IsDateString() scheduledAt?: string;
  @IsOptional() @IsString()  notes?: string;
}
