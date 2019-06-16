const config = require("../config").mqtt;
const DeviceUpdate = require("./DeviceUpdate");
const EventEmitter = require("events");
const Events = require("./Events");
const mqtt = require("mqtt");

class MqttClient extends EventEmitter {
    constructor() {
        super();
        const brokerUrl = `${config.protocol}://${config.hostname}:${config.port}`;
        const client = mqtt.connect(brokerUrl, {
            username: config.username,
            password: config.password
        });
        client.on("error", error => this._onError(error));
        client.on("connect", () => this._onConnected);

        client.on('message', (topic, message) => this._onMessage(topic, message));
        client.subscribe(`${config.topicPrefix}/Devices/#`);
    }

    /**
     *
     * @param error
     * @private
     */
    _onError(error) {
        console.error(error);
    }

    /**
     *
     * @param topic
     * @param message
     * @private
     */
    _onMessage(topic, message) {
        const deviceUpdate = new DeviceUpdate(message);
        this.emit(Events.Device.Update, topic, deviceUpdate);
    }

    /**
     *
     * @private
     */
    _onConnected() {
        console.log("MQTT: successfully connected to broker.");
    }
}

module.exports = MqttClient;