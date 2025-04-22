import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ChatBot = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === "/") {
            const script = document.createElement("script");
            script.async = true;
            script.type = "text/javascript";
            script.setAttribute("data-id", "7819478482");
            script.id = "chatling-embed-script";
            script.src = "https://chatling.ai/js/embed.js";

            document.body.appendChild(script);
        }

        return () => {
            const existingScript = document.getElementById("chatling-embed-script");
            if (existingScript) {
                document.body.removeChild(existingScript);
            }
            const chatElements = document.querySelectorAll('[id^="chatling"]');
            chatElements.forEach(element => element.remove());
        };
    }, [location.pathname]);

    useEffect(() => {
        if (location.pathname === "/") {
            (window as any).chtlConfig = { chatbotId: "7819478482" };
        }
    }, [location.pathname]);

    return null;
};

export default ChatBot;