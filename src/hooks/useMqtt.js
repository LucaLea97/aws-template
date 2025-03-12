
import { useEffect, useRef, useState, useCallback } from "react";
import mqtt from "mqtt";

// Replace with your HiveMQ WebSocket URL
const url = `${import.meta.env.VITE_MQTT_PROTOCOL}://${import.meta.env.VITE_MQTT_WS_URL}`;
const options = {
    clientId: `mqttjs_${Math.random().toString(16).substring(2, 8)}`,
    username: import.meta.env.VITE_MQTT_USERNAME,
    password: import.meta.env.VITE_MQTT_PASSWORD,
};

export function useMqtt() {
    const [ledState, setLedState] = useState({ id: null, state: "OFF" });
    const clientRef = useRef(null);
    const topic = import.meta.env.VITE_MQTT_TOPIC;

    useEffect(() => {
        if (!clientRef.current) {
            const client = mqtt.connect(url, options);
            clientRef.current = client;

            client.on("connect", () => {
                console.log("Connected to HiveMQ");
                client.subscribe(topic, (error) => {
                    if (error) {
                        console.error("Subscription error:", error);
                    } else {
                        console.log("Subscribed to " + topic);
                    }
                });
            });

            client.on("message", (fromTopic, message) => {
                if (fromTopic === topic) {
                    try {
                        const data = JSON.parse(message.toString());
                        setLedState(data);
                    } catch (error) {
                        console.error("Error parsing message:", error);
                    }
                }
            });

            client.on("error", (error) => {
                console.error("MQTT Error:", error);
            });
        }

        return () => {
            if (clientRef.current) {
                console.log("Disconnecting MQTT client...");
                clientRef.current.end(() => {
                    console.log("Disconnected");
                });
                clientRef.current = null;
            }
        };
    }, [topic]);

    // Ensuring the client is connected before publishing
    const sendMessage = useCallback((id, state) => {
        if (clientRef.current?.connected) {
            const message = JSON.stringify({ id, state });
            clientRef.current.publish(topic, message);
        } else {
            console.warn("MQTT Client is not connected. Cannot publish message.");
        }
    }, [topic]);

    return { ledState, sendMessage };
}
