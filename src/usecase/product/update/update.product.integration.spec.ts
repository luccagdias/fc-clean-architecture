import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import UpdateProductUseCase from "./update.product.usecase";
import { Sequelize } from "sequelize-typescript";

describe("Test update product use case", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should update a product", async () => {
        const productRepository = new ProductRepository();
        const usecase = new UpdateProductUseCase(productRepository);

        const product = new Product("1", "Product 1", 100);
        await productRepository.create(product);

        const input = {
            id: "1",
            name: "Product Updated",
            price: 200
        };

        const output = await usecase.execute(input);

        expect(output).toEqual({
            id: input.id,
            name: input.name,
            price: input.price,
        });

        const updatedProduct = await productRepository.find(input.id);
        expect(updatedProduct).toBeDefined();
        expect(updatedProduct.name).toBe(input.name);
        expect(updatedProduct.price).toBe(input.price);
    });

    it("should throw an error when product is not found", async () => {
        const productRepository = new ProductRepository();
        const usecase = new UpdateProductUseCase(productRepository);

        const input = {
            id: "999",
            name: "Product Updated",
            price: 200
        };

        await expect(usecase.execute(input)).rejects.toThrow("Product not found");
    });

    it("should throw an error when name is empty", async () => {
        const productRepository = new ProductRepository();
        const usecase = new UpdateProductUseCase(productRepository);

        const product = new Product("1", "Product 1", 100);
        await productRepository.create(product);

        const input = {
            id: "1",
            name: "",
            price: 200
        };

        await expect(usecase.execute(input)).rejects.toThrow("Name is required");
    });

    it("should throw an error when price is less than zero", async () => {
        const productRepository = new ProductRepository();
        const usecase = new UpdateProductUseCase(productRepository);

        const product = new Product("1", "Product 1", 100);
        await productRepository.create(product);

        const input = {
            id: "1",
            name: "Product Updated",
            price: -1
        };

        await expect(usecase.execute(input)).rejects.toThrow("Price must be greater than zero");
    });
}); 