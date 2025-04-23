import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ListProductUseCase from "./list.product.usecase";
import { Sequelize } from "sequelize-typescript";

describe("Test list product use case", () => {
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

    it("should list all products", async () => {
        const productRepository = new ProductRepository();
        const usecase = new ListProductUseCase(productRepository);

        const product1 = new Product("1", "Product 1", 100);
        const product2 = new Product("2", "Product 2", 200);

        await productRepository.create(product1);
        await productRepository.create(product2);

        const output = await usecase.execute({});

        expect(output.products.length).toBe(2);
        expect(output.products[0]).toEqual({
            id: "1",
            name: "Product 1",
            price: 100,
        });
        expect(output.products[1]).toEqual({
            id: "2",
            name: "Product 2",
            price: 200,
        });
    });

    it("should return empty list when no products exist", async () => {
        const productRepository = new ProductRepository();
        const usecase = new ListProductUseCase(productRepository);

        const output = await usecase.execute({});

        expect(output.products.length).toBe(0);
    });
}); 