/**
 * @swagger
 * tags:
 *   name: Screens
 *   description: Screen management routes
 */

/**
 * @swagger
 * /api/screens:
 *   post:
 *     summary: Create screen with auto seat generation (Admin only)
 *     tags: [Screens]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - theaterId
 *               - name
 *               - rows
 *               - seatsPerRow
 *               - layoutType
 *             properties:
 *               theaterId:
 *                 type: string
 *                 example: 64f1b2c3d4e5f6a7b8c9d0e1
 *               name:
 *                 type: string
 *                 example: Screen 1
 *               rows:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: A
 *                     type:
 *                       type: string
 *                       enum: [regular, premium, vip]
 *                       example: regular
 *                 example:
 *                   - name: A
 *                     type: regular
 *                   - name: B
 *                     type: premium
 *                   - name: C
 *                     type: vip
 *               seatsPerRow:
 *                 type: number
 *                 example: 10
 *               layoutType:
 *                 type: string
 *                 example: classic
 *     responses:
 *       201:
 *         description: Screen created with seats auto generated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden, Admin only
 *       404:
 *         description: Theater not found
 */