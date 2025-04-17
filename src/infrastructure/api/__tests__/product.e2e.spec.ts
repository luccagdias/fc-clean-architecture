import request from "supertest";
import { app } from "../express";
import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../product/repository/sequelize/product.model";

describe("E2E test for product", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        name: "Product 1",
        price: 100,
        type: "a"
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Product 1");
    expect(response.body.price).toBe(100);
  });

  it("should list all products", async () => {
    const response1 = await request(app)
      .post("/product")
      .send({
        name: "Product 1",
        price: 100,
        type: "a"
      });
    expect(response1.status).toBe(200);

    const response2 = await request(app)
      .post("/product")
      .send({
        name: "Product 2",
        price: 200,
        type: "a"
      });
    expect(response2.status).toBe(200);

    const listResponse = await request(app).get("/product").send();

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.products.length).toBe(2);
    expect(listResponse.body.products[0].name).toBe("Product 1");
    expect(listResponse.body.products[0].price).toBe(100);
    expect(listResponse.body.products[1].name).toBe("Product 2");
    expect(listResponse.body.products[1].price).toBe(200);
  });
}); 