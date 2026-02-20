import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, ValidateNested } from "class-validator";
import { OrderItemDto } from "./order-item.dto";

enum OrderStatus {
  PENDING = 'PENDING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

const OrderStatusList = [
  OrderStatus.PENDING,
  OrderStatus.DELIVERED,
  OrderStatus.CANCELLED
];

export class CreateOrderDto {

  /*   @IsNumber()
    @IsPositive()
    totalAmount: number;
  
    @IsNumber()
    @IsPositive()
    totalItems: number;
  
    @IsEnum(OrderStatusList, {
      message: `Posible status values are ${OrderStatusList}`
    })
    @IsOptional()
    status: OrderStatus = OrderStatus.PENDING;
  
    @IsBoolean()
    @IsOptional()
    paid: boolean = false; */


  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(
    () => OrderItemDto
  )
  items: OrderItemDto[]
}
