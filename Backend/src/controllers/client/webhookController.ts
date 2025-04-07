import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../constants/statusContstants";
import Stripe from "stripe";
import { env } from "../../config/env.config";
import Escrow from "../../models/admin/escrowModel";
import Contract from "../../models/client/contractModel";

const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-02-24.acacia"
});

export default class WebhookController {
    async stripeWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
        console.log('🔹 Received a request in webhook');

        const sig = req.headers["stripe-signature"] as string | undefined;

        if (!sig) {
            console.error("❌ Missing Stripe signature in header");
            res.status(HttpStatus.BAD_REQUEST).send('Missing stripe-signature in header');
            return;
        }

        let event;
        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                env.STRIPE_WEBHOOK_SECRET!
            );
            console.log('✅ Webhook signature verification successful');
        } catch (error) {
            console.error('❌ Webhook signature verification failed:', (error as Error).message);
            res.status(HttpStatus.BAD_REQUEST).send(`Webhook Error: ${(error as Error).message}`);
            return;
        }

        try {
            switch (event.type) {
                case "checkout.session.completed":
                    const session = event.data.object as Stripe.Checkout.Session;
                    console.log("💰 Checkout session completed.");

                    const clientId = session.metadata?.clientId;
                    const freelancerId = session.metadata?.freelancerId; 
                    const jobId = session.metadata?.jobId;
                    const paymentAmount = session.amount_total ? session.amount_total / 100 : 0;

                    if (!clientId || !freelancerId || !jobId) {
                        console.error("❌ Missing metadata in Stripe session.");
                        res.status(HttpStatus.BAD_REQUEST).send("Metadata missing in session");
                        return;
                    }

                    console.log(`✅ Client ${clientId} paid for job ${jobId}, amount: ${paymentAmount}`);

                    const platformFee = paymentAmount * 0.10;
                    const freelancerEarning = paymentAmount - platformFee;

                    const contract = await Contract.findOneAndUpdate(
                        { clientId, jobId },
                        { $set: { escrowPaid: true } },
                        { new: true, upsert: true }
                    );
                    
                    if (!contract) {
                        console.error("❌ Contract not found or couldn't be created.");
                        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send("Contract not found");
                        return;
                    }
                    
                    await Escrow.create({
                        clientId,
                        freelancerId,
                        jobId,
                        contractId: contract._id,
                        amount: paymentAmount,
                        platformFee,
                        freelancerEarning,
                        status: "funded"
                    });
                
                    console.log(`✅ Contract status updated to "Started" for job ${jobId}`);
                    res.status(HttpStatus.OK).send("Escrow funded & contract started");
                    return;

                case "checkout.session.expired":
                    console.log("⚠️ Payment session expired.");
                    res.status(HttpStatus.OK).send("Session expired");
                    return;

                default:
                    console.log(`🔸 Unhandled event type: ${event.type}`);
                    res.status(HttpStatus.OK).send(`Unhandled event: ${event.type}`);
                    return;
            }
        } catch (error) {
            console.error("❌ Error processing webhook event:", (error as Error).message);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send("Internal Server Error");
        }
    }
};