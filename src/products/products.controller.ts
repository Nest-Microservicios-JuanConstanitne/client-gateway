import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PRODUCT_SERVICE } from 'src/config';
import { PaginationDto } from '../common/dto/pagination.dto';
import { catchError } from 'rxjs';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productService: ClientProxy
  ) { }


  @Post()
  createProduct(
    @Body() createProductDto: CreateProductDto
  ) {
    return this.productService.send({ cmd: 'create_product' }, createProductDto);
  }

  @Get()
  findAllProducts(
    @Query() paginationDto: PaginationDto
  ) {
    return this.productService.send({ cmd: 'find_all_products' }, paginationDto);
  }

  @Get(':id')
  async findByOne(
    @Param('id', ParseIntPipe) id: string
  ) {
    // 1 Manejo de error con Try metodo tradicional
    /* try {
      const product = await firstValueFrom(
        this.productService.send({ cmd: 'find_one_product' }, { id })
      );
      return product;
    } catch (error) {
      throw new BadRequestException(error);
    } */

    // 2 Manejarlo con RpcExceptions con obeservables
    return this.productService.send({ cmd: 'find_one_product' }, { id })
      .pipe(
        catchError(err => { throw new RpcException(err) })
      );
  }

  @Delete(':id')
  deleteProduct(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.productService.send({ cmd: 'delete_product' }, { id })
  }


  @Patch(':id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productService.send({ cmd: 'update_product' }, {
      id,
      ...updateProductDto
    }).pipe(
      catchError(err => { throw new RpcException(err) })
    );
  }

}
