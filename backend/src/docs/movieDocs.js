/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Movie management routes
 */

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Get all active movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: List of active movies
 */

/**
 * @swagger
 * /api/movies/{id}:
 *   get:
 *     summary: Get movie by id
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie id
 *     responses:
 *       200:
 *         description: Movie details
 *       404:
 *         description: Movie not found
 */

/**
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Create movie (Admin only)
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - duration
 *               - genre
 *               - language
 *               - releaseDate
 *               - status
 *             properties:
 *               title:
 *                 type: string
 *                 example: Avengers Endgame
 *               description:
 *                 type: string
 *                 example: Marvel movie
 *               duration:
 *                 type: number
 *                 example: 180
 *               genre:
 *                 type: string
 *                 enum: [action, comedy, drama, horror, romance]
 *                 example: action
 *               language:
 *                 type: string
 *                 example: English
 *               releaseDate:
 *                 type: string
 *                 example: 2024-01-01
 *               posterUrl:
 *                 type: string
 *                 example: https://example.com/poster.jpg
 *               status:
 *                 type: string
 *                 enum: [upcoming, active, inactive]
 *                 example: active
 *               rating:
 *                 type: number
 *                 example: 8.5
 *     responses:
 *       201:
 *         description: Movie created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden, Admin only
 */

/**
 * @swagger
 * /api/movies/{id}/archive:
 *   patch:
 *     summary: Archive movie (Admin only)
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie id
 *     responses:
 *       200:
 *         description: Movie archived successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden, Admin only
 *       404:
 *         description: Movie not found
 */

/**
 * @swagger
 * /api/movies/search:
 *   get:
 *     summary: Search movies by title
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie title to search
 *         example: Avengers
 *     responses:
 *       200:
 *         description: List of matching movies
 *       404:
 *         description: No movies found
 */