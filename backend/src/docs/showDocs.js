/**
 * @swagger
 * tags:
 *   name: Shows
 *   description: Show management routes
 */

/**
 * @swagger
 * /api/shows:
 *   post:
 *     summary: Create show (Admin only)
 *     tags: [Shows]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movieId
 *               - screenId
 *               - startTime
 *               - basePrice
 *             properties:
 *               movieId:
 *                 type: string
 *                 example: 64f1b2c3d4e5f6a7b8c9d0e1
 *               screenId:
 *                 type: string
 *                 example: 64f1b2c3d4e5f6a7b8c9d0e2
 *               startTime:
 *                 type: string
 *                 example: 2024-01-01T10:00:00.000Z
 *               basePrice:
 *                 type: number
 *                 example: 200
 *     responses:
 *       201:
 *         description: Show created successfully
 *       400:
 *         description: Show timing overlaps with existing show
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden, Admin only
 *       404:
 *         description: Movie or screen not found
 */

/**
 * @swagger
 * /api/shows/movie/{movieId}:
 *   get:
 *     summary: Get all scheduled shows for a movie
 *     tags: [Shows]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie id
 *     responses:
 *       200:
 *         description: List of scheduled shows with screen details
 *       404:
 *         description: Movie not found
 */

/**
 * @swagger
 * /api/shows/{id}:
 *   get:
 *     summary: Get show by id
 *     tags: [Shows]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Show id
 *     responses:
 *       200:
 *         description: Show details
 *       404:
 *         description: Show not found
 */