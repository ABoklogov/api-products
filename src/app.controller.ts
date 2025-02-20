import { BadRequestException, Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateDto } from './dto/create.dto';

enum SortOptions {
  ID_ASC = 'id_asc',
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  NAME_ASC = 'name_asc',
  NAME_DESC = 'name_desc',
};

enum FilterOptions {
  PRICE = 'price',
  PICTURE = 'picture',
  SALE = 'sale',
  DESCRIPTION = 'description',
};

@Controller('products')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getProducts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('sort', new DefaultValuePipe(SortOptions.ID_ASC)) sort?: string,
    @Query('filter') filter?: string | string[],
  ) {
    let filterParams: string[] = [];
    if (!Object.values(SortOptions).includes(sort as SortOptions)) {
      throw new BadRequestException(`Invalid sort parameter: ${sort}`);
    };
    
    if (filter) {
      if (typeof filter === 'string') {
        const filterParam = filter?.split('_')[0];
        filterParams = [filter];

        if (!Object.values(FilterOptions).includes(filterParam as FilterOptions)) {
          throw new BadRequestException(`Invalid filter parameter: ${filterParam}`);
        };
      } else {
        filterParams = [...filter];
        filter.forEach(el => {
          if (!Object.values(FilterOptions).includes(el.split('_')[0] as FilterOptions)) {
            throw new BadRequestException(`Invalid filter parameter: ${el.split('_')[0]}`);
          };
        });
      };
    };
    
    return this.appService.getProducts(
      page || 1, 
      limit || 10,
      sort || SortOptions.ID_ASC,
      filterParams.find(param => param.startsWith(FilterOptions.PRICE)),
      filterParams.filter(param => !param.startsWith(FilterOptions.PRICE))
    );
  }

  @Get(':id')
  getProduct(@Param('id', ParseIntPipe) id: number) {
    return this.appService.getProduct(id);
  }
  
  @UsePipes(new ValidationPipe())
  @Post()
  async addProduct(@Body() dto: CreateDto) {
    const res = await this.appService.addProduct(dto);
    return res;
  }
}
