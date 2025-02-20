import { Injectable } from '@nestjs/common';
import { CreateDto } from './dto/create.dto';
import { DatabaseService } from './database/database.service';

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
  }
}
