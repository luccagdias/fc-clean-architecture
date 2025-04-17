import ListProductUseCase from "./list.product.usecase";
import Product from "../../../domain/product/entity/product";

const product1 = new Product("123", "Product 1", 100);
const product2 = new Product("456", "Product 2", 200);

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn().mockReturnValue(Promise.resolve([product1, product2])),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit test list product use case", () => {
  it("should list all products", async () => {
    const productRepository = MockRepository();
    const usecase = new ListProductUseCase(productRepository);

    const output = await usecase.execute({});

    expect(output.products.length).toBe(2);
    expect(output.products[0]).toEqual({
      id: product1.id,
      name: product1.name,
      price: product1.price,
    });
    expect(output.products[1]).toEqual({
      id: product2.id,
      name: product2.name,
      price: product2.price,
    });
  });

  it("should return empty list when no products exist", async () => {
    const productRepository = MockRepository();
    productRepository.findAll.mockReturnValue(Promise.resolve([]));
    const usecase = new ListProductUseCase(productRepository);

    const output = await usecase.execute({});

    expect(output.products.length).toBe(0);
  });
}); 