/**
 * @swagger
 * /api/cashmachine/balance:
 *   get:
 *     summary: Get current balance
 *     tags: [Cashmachine]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current balance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balance:
 *                   type: number
 *       401:
 *         description: Unauthorized
 */