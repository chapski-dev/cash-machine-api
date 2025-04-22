/**
 * @swagger
 * /api/auth/check-email:
 *   post:
 *     summary: Check if an email is already registered
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Email existence check result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 is_exist:
 *                   type: boolean
 *       400:
 *         description: Bad request
 */