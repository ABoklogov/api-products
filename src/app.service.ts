import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateDto, MFile } from './dto/create.dto';
import { DatabaseService } from './database/database.service';
import * as sharp from 'sharp';
import { join } from 'path';
import { access, mkdir, writeFile } from 'fs/promises';

@Injectable()
export class AppService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getProducts(
    page: number, 
    limit: number,
    sort: string,
    filterPrice?: string,
    filterOther?: string[],
  ) {
    const [field, order] = sort.split('_');
    const [minPrice, maxPrice] = filterPrice?.split('_')[1]?.split('-').map(Number) || [undefined, undefined];

    const wherePrice = minPrice !== undefined && maxPrice !== undefined ? {
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
    } : {};

    const whereOther = filterOther?.reduce((acc, filter) => {
      const [key, value] = filter.split('_');
      acc[key] = value === 'true' ? { not: null } : null;
      return acc;
    }, {}) || {};

    const [total, products] = await Promise.all([
      this.databaseService.product.count({
        where: {
          ...wherePrice,
          ...whereOther,
        }
      }),
      this.databaseService.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [field]: order },
        where: {
          ...wherePrice,
          ...whereOther,
        }
      }),
    ]);

    return {
      total,
      page,
      limit,
      products,
    };
  };

  async getProduct(id: number) {
    return await this.databaseService.product.findUnique({ where: { id } })
  };

  async addProduct(dto: CreateDto) {
    return await this.databaseService.product.create({
      data: dto
    })
  };

  async saveFile(file: MFile, folder = 'default', id: number) {
    const uploadFolder = join(__dirname, '..', 'static', folder);

    try {
      await access(uploadFolder);
    } catch (error) {
      await mkdir(uploadFolder, {recursive: true});
    };

    try {
      await writeFile(join(uploadFolder, file.originalname), file.buffer);
    } catch (error) {
      throw new InternalServerErrorException('error writing files');
    };

    return this.databaseService.product.update({
      where: { id },
      data: { picture: `/static/${folder}/${file.originalname}` },
    });
  };

  convertToWebP(file: Buffer): Promise<Buffer> {
    return sharp(file).webp().toBuffer();
  };

  async filterFiles(file: MFile, id: number) {
    const mimetype = file.mimetype;

    if (!mimetype.includes('image')) {
      throw new BadRequestException('file format not supported');
    };

    const buffer = await this.convertToWebP(file.buffer);
    return new MFile({
      buffer,
      originalname: `${id}.webp`,
      mimetype,
    });
  };
}