import { 
  BadRequestException, 
  Body, 
  Controller, 
  DefaultValuePipe, 
  Delete, 
  Get, 
  Param, 
  ParseIntPipe, 
  Patch, 
  Post, 
  Query, 
  UploadedFiles, 
  UseInterceptors, 
  UsePipes, 
  ValidationPipe 
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateDto, FilterOptions, SortOptions } from './dto/create.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

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
  async getProduct(@Param('id', ParseIntPipe) id: number) {
    return await this.appService.getProduct(id);
  }
  
  @UsePipes(new ValidationPipe())
  @Post()
  async addProduct(@Body() dto: CreateDto) {
    const res = await this.appService.addProduct(dto);
    return res;
  }

  @Delete(':id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return await this.appService.deleteProduct(id);
  }

  @Patch('picture/update/:id')
  @UseInterceptors(FilesInterceptor('picture'))
  async uploadFile(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files) {
      throw new BadRequestException(`Not files`);
    };

    const newFile = await this.appService.filterFiles(files[0], id);
    return this.appService.saveFile(newFile, id);
  }

  @Patch('picture/delete/:id')
  @UseInterceptors(FilesInterceptor('picture'))
  async deleteFile(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.appService.deletePicture(id);
  }
}
