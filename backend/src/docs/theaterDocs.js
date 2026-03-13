/**
 * @swagger
 * tags:
 *   name: Theaters
 *   description: Theater management routes
 */

/**
 * @swagger
 * /api/theaters:
 *   get:
 *     summary: Get all active theaters
 *     tags: [Theaters]
 *     responses:
 *       200:
 *         description: List of active theaters
 */

/**
 * @swagger
 * /api/theaters/{id}:
 *   get:
 *     summary: Get theater by id
 *     tags: [Theaters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Theater id
 *     responses:
 *       200:
 *         description: Theater details
 *       404:
 *         description: Theater not found
 */

/**
 * @swagger
 * /api/theaters:
 *   post:
 *     summary: Create theater (Admin only)
 *     tags: [Theaters]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - city
 *               - address
 *               - screenCount
 *             properties:
 *               name:
 *                 type: string
 *                 example: PVR Cinemas
 *               city:
 *                 type: string
 *                 example: Mumbai
 *               address:
 *                 type: string
 *                 example: 123 Main Street
 *               screenCount:
 *                 type: number
 *                 example: 5
 *               status:
 *                 type: string
 *                 enum: [active, inactive, maintenance]
 *                 example: active
 *     responses:
 *       201:
 *         description: Theater created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden, Admin only
 */