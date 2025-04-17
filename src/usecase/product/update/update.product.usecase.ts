import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import { InputUpdateProductDto, OutputUpdateProductDto } from "./update.product.dto";
import Product from "../../../domain/product/entity/product";
import NotificationError from "../../../domain/@shared/notification/notification.error";

export default class UpdateProductUseCase {
  private productRepository: ProductRepositoryInterface;

  constructor(productRepository: ProductRepositoryInterface) {
    this.productRepository = productRepository;
  }

  async execute(input: InputUpdateProductDto): Promise<OutputUpdateProductDto> {
    const product = await this.productRepository.find(input.id);
    
    // Validate input before updating
    const tempProduct = new Product(input.id, input.name, input.price);
    if (tempProduct.notification.hasErrors()) {
      throw new NotificationError(tempProduct.notification.getErrors());
    }
    
    product.changeName(input.name);
    product.changePrice(input.price);
    
    await this.productRepository.update(product);

    return {
      id: product.id,
      name: product.name,
      price: product.price,
    };
  }
} 