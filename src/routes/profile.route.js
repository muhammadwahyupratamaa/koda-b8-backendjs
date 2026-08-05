import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import profileController from "../controllers/profile.controller.js";

const router = Router();
router.use(authMiddleware);

/**
 * @openapi
 * tags:
 *   name: Profile
 *   description: User Profile Management API
 */

/**
 * @openapi
 * /profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieve the authenticated user's profile information.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/", profileController.getProfile);

/**
 * @openapi
 * /profile:
 *   put:
 *     summary: Update user profile
 *     description: Update the authenticated user's profile information.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Raply
 *               email:
 *                 type: string
 *                 example: raply@mail.com
 *               phone:
 *                 type: string
 *                 example: "08123456789"
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: "2000-01-01"
 *               gender:
 *                 type: string
 *                 example: Laki-laki
 *               avatarUrl:
 *                 type: string
 *                 example: https://picsum.photos/300
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.put("/", profileController.updateProfile);

/**
 * @openapi
 * /profile/password:
 *   put:
 *     summary: Update user password
 *     description: Change the authenticated user's password.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: "123456"
 *               newPassword:
 *                 type: string
 *                 example: "654321"
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       401:
 *         description: Old password is incorrect
 *       500:
 *         description: Internal server error
 */
router.put("/password", profileController.updatePassword);

export default router;
