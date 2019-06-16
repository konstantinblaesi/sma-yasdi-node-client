const DeviceUpdate = require("./DeviceUpdate");
const Events = require("./Events");
const InfluxDbClient = require("./InfluxDbClient");
const MqttClient = require("./MqttClient");
const config = require("../config");

/**
 * @type {InfluxDbClient}
 */
let influxDbClient;

function onError(error) {
    console.error(error);
}

/**
 *
 * @param topic mqtt topic the device update was published under
 * @param {DeviceUpdate} deviceUpdate
 */
async function onDeviceUpdate(topic, deviceUpdate) {
    await influxDbClient.write(deviceUpdate);
    console.log("Saved device update to InfluxDB:", deviceUpdate.name);
}

(async () => {
    influxDbClient = new InfluxDbClient();
    //await influxDbClient.createRetentionPolicies();
    const mqttClient = new MqttClient(config.mqtt);
    mqttClient.on(Events.Device.Update, onDeviceUpdate);
})().catch(onError);