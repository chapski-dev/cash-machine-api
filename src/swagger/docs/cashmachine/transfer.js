/**
 * @swagger
 * /api/cashmachine/transfer:
 *   post:
 *     summary: Transfer money to another user
 *     tags: [Cashmachine]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipient_email
 *               - amount
 *             properties:
 *               recipient_email:
 *                 type: string
 *                 format: email
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Transfer successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 balance:
 *                   type: number
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error or insufficient funds
 */