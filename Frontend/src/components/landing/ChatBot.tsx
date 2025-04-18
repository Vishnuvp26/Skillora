import { useEffect } from "react";

const ChatBot = () => {
    useEffect(() => {
        const script = document.createElement("script");
        script.async = true;
        script.type = "text/javascript";
        script.setAttribute("data-id", "7819478482");
        script.id = "chatling-embed-script";
        script.src = "https://chatling.ai/js/embed.js";

        document.body.appendChild(script);

        return () => {
            const existingScript = document.getElementById("chatling-embed-script");
            if (existingScript) {
                document.body.removeChild(existingScript);
            }
        };
    }, []);

    useEffect(() => {
        (window as any).chtlConfig = { chatbotId: "7819478482" };
    }, []);

    return null;
};

export default ChatBot;