import paho.mqtt.client as mqtt
import time

BROKER = "broker.hivemq.com"
PORT = 1883

# Define all your devices here
DEVICES = {
    "/home/livingroom/light1": "💡 Living Room Light",
    "/home/livingroom/fan1": "🌀 Living Room Fan",
    "/home/livingroom/ac1": "❄️ Living Room AC",
    "/home/kitchen/heater1": "🔥 Kitchen Heater",
    "/home/kitchen/fridge1": "🧊 Kitchen Fridge",
    "/home/bedroom/light1": "💡 Bedroom Light",
    "/home/bedroom/ac2": "❄️ Bedroom AC"
}

device_states = {topic: False for topic in DEVICES.keys()}


def on_connect(client, userdata, flags, rc):
    print(f"[SYSTEM] Connected to MQTT Broker with code {rc}")
    for topic in DEVICES.keys():
        client.subscribe(topic)
        print(f"[SYSTEM] Subscribed to {topic}")


def on_message(client, userdata, msg):
    topic = msg.topic
    payload = msg.payload.decode()
    device_name = DEVICES.get(topic, "Unknown Device")

    if payload == "ON":
        device_states[topic] = True
        print(f"{device_name} → Turned ON ✅")
    elif payload == "OFF":
        device_states[topic] = False
        print(f"{device_name} → Turned OFF ❌")
    else:
        print(f"{device_name} → Unknown command: {payload}")

    # Publish the new status back to the server
    status_topic = f"{topic}/status"
    status_message = "ON" if device_states[topic] else "OFF"
    client.publish(status_topic, status_message)
    print(f"📡 Published status: {status_message} to {status_topic}\n")


def on_disconnect(client, userdata, rc):
    print("[SYSTEM] Disconnected from MQTT Broker!")


def main():
    client = mqtt.Client("CasaControl_Simulator")
    client.on_connect = on_connect
    client.on_message = on_message
    client.on_disconnect = on_disconnect

    print("[SYSTEM] Connecting to broker...")
    client.connect(BROKER, PORT, 60)

    client.loop_start()

    try:
        while True:
            # Optional: Print current states periodically
            print("\n📊 Current Device States:")
            for topic, name in DEVICES.items():
                state = "ON" if device_states[topic] else "OFF"
                print(f"  - {name}: {state}")
            print("-" * 40)
            time.sleep(10)

    except KeyboardInterrupt:
        print("\n[SYSTEM] Exiting gracefully...")
        client.loop_stop()
        client.disconnect()


if __name__ == "__main__":
    main()
