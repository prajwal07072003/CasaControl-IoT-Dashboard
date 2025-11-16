import paho.mqtt.client as mqtt
import time

BROKER = "broker.hivemq.com"
PORT = 1883
TOPIC_SUB = "/home/livingroom/fan1"
TOPIC_PUB = "/home/livingroom/fan1/status"

DEVICE_NAME = "SimulatedFan"
status = "OFF"

def on_connect(client, userdata, flags, rc):
    print(f"[{DEVICE_NAME}] Connected to broker with code {rc}")
    client.subscribe(TOPIC_SUB)
    print(f"[{DEVICE_NAME}] Subscribed to {TOPIC_SUB}")

def on_message(client, userdata, msg):
    global status
    payload = msg.payload.decode()
    print(f"[{DEVICE_NAME}] Received: {payload}")

    if payload.upper() == "ON":
        status = "ON"
        print("🌀 Fan is spinning 🌀")
    elif payload.upper() == "OFF":
        status = "OFF"
        print("💤 Fan stopped")

    client.publish(TOPIC_PUB, status)

client = mqtt.Client(client_id=DEVICE_NAME, protocol=mqtt.MQTTv311)
client.on_connect = on_connect
client.on_message = on_message

client.connect(BROKER, PORT, 60)
client.loop_start()

try:
    while True:
        time.sleep(5)
except KeyboardInterrupt:
    client.loop_stop()
    client.disconnect()
