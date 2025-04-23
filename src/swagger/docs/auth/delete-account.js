

/**
 * @swagger
 * /api/auth/delete-account:
 *   delete:
 *     summary: Delete user account
 *     tags: [Auth]
 *     requestBody:
 *       required: false
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Account deleted!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Not valid data
 */


