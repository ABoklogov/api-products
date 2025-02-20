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

export class MFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;

  constructor(file: Express.Multer.File | MFile) {
    this.buffer = file.buffer;
    this.mimetype = file.mimetype;
    this.originalname = file.originalname;
  }
}