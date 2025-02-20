import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @IsString()
  @IsNotEmpty()
  vendorCode: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  picture?: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  sale?: number;
}