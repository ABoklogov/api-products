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
};

export class MFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;

  constructor(file: Express.Multer.File | MFile) {
    this.buffer = file.buffer;
    this.mimetype = file.mimetype;
    this.originalname = file.originalname;
  }
};

export enum SortOptions {
  ID_ASC = 'id_asc',
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  NAME_ASC = 'name_asc',
  NAME_DESC = 'name_desc',
};

export enum FilterOptions {
  PRICE = 'price',
  PICTURE = 'picture',
  SALE = 'sale',
  DESCRIPTION = 'description',
};