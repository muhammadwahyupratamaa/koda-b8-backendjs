import { afterAll, describe, expect, test } from "@jest/globals";

import sequelize from "../src/config/sequelize.js";
import User from "../src/models/user.js";

describe("User model validation", () => {
  test("accepts valid user data", async () => {
    const user = User.build({
      name: "Wahyu",
      email: "wahyu@example.com",
      password: "hashed-password",
      role: "user",
    });

    await expect(user.validate()).resolves.toBeDefined();
  });

  test("rejects invalid email", async () => {
    const user = User.build({
      name: "Wahyu",
      email: "email-tidak-valid",
      password: "hashed-password",
      role: "user",
    });

    await expect(user.validate()).rejects.toThrow(
      "Validation isEmail on email failed",
    );
  });

  test("rejects name shorter than three characters", async () => {
    const user = User.build({
      name: "Wa",
      email: "wahyu@example.com",
      password: "hashed-password",
      role: "user",
    });

    await expect(user.validate()).rejects.toThrow(
      "Validation len on name failed",
    );
  });

  afterAll(async () => {
    await sequelize.close();
  });
});