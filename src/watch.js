const DeviceUpdate = require("./DeviceUpdate");
const Events = require("./Events");
const MqttClient = require("./MqttClient");
const config = require("../config");

function onError(error) {
    console.error(error);
}

/**
 *
 * @param topic mqtt topic the device update was published under
 * @param {DeviceUpdate} deviceUpdate
 */
function onDeviceUpdate(topic, deviceUpdate) {
    const json = (deviceUpdate.toJSON());
    console.dir(json, {depth: null});
}

(async () => {
    const mqttClient = new MqttClient();
    mqttClient.on(Events.Device.Update, onDeviceUpdate);
})().catch(onError);