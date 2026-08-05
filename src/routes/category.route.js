import { Router } from "express";
import categoryController from "../controllers/category.controller.js";

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Categories
 *   description: Category Management API
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     description: Retrieve a list of all product categories.
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: Shoes
 *       500:
 *         description: Internal server error
 */
router.get("/", categoryController.getAll);

export default router;
