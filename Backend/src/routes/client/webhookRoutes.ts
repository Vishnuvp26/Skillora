import express from "express";
import WebhookController from '../../controllers/client/webhookController';

const webhookRoutes = express.Router();

const webhookController = new WebhookController();

webhookRoutes.post('/', webhookController.stripeWebhook.bind(webhookController));

export default webhookRoutes;