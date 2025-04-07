import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const EscrowFaqAccordion = () => {
    return (
        <div className="pt-16">
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger>What is an Escrow Wallet?</AccordionTrigger>
                    <AccordionContent>
                        An Escrow Wallet securely holds funds until the agreed project milestones are completed.
                        This ensures both the freelancer and client are protected during the transaction process.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>How can I request a refund?</AccordionTrigger>
                    <AccordionContent>
                        Refunds can be requested through the contract page by initiating a dispute. Once both parties
                        agree or admin resolves the issue, the refund is processed from the escrow wallet.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>What happens if a freelancer quits midway through a project?</AccordionTrigger>
                    <AccordionContent>
                        If a freelancer leaves a project midway, clients can raise a dispute. Funds in the escrow
                        wallet remain secure and will be refunded or reassigned based on the outcome of the dispute
                        resolution process. Please note that platform charges may still apply and will be deducted
                        accordingly.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};