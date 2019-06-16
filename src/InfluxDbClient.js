const {InfluxDB} = require("influx");
const config = require("../config").influxDB;

class InfluxDbClient {
    constructor() {
        const influxOptions = {
            host: config.host,
            port: config.port,
            database: config.database,
            username: config.username,
            password: config.password,
        };
        this._influxClient = new InfluxDB(influxOptions);
    }

    /**
     * Create all retention policies from the config that do not exist yet
     * @return {Promise<void>}
     */
    async createRetentionPolicies() {
        const retentionPolicies = await this._influxClient.showRetentionPolicies(config.database);
        const names = retentionPolicies.map(retentionPolicy => retentionPolicy.name);
        await Promise.all(config.retentionPolicies.map(retentionPolicy => {
            if (!names.includes(retentionPolicy.name)) {
                return this._influxClient.createRetentionPolicy(
                    retentionPolicy.name, {
                        database: config.database,
                        duration: retentionPolicy.duration,
                        replication: retentionPolicy.replication
                    }
                )
            }
        }));
    }

    /**
     *
     * @param {DeviceUpdate} deviceUpdate
     * @return {Promise<void>}
     */
    async write(deviceUpdate) {
        const schema = config.schemas[0];
        const points = [];
        for (const spotChannels of deviceUpdate.spotChannels) {
            const point = {
                tags: {
                    name: deviceUpdate.name,
                    type: deviceUpdate.type,
                    serialNumber: deviceUpdate.serialNumber
                },
                fields: {},
                timestamp: spotChannels.timestamp
            };
            for (const numericChannel of spotChannels.numericChannels) {
                point.fields[`${numericChannel.name}_in_${numericChannel.unit}`] = numericChannel.value;
            }
            for (const textChannel of spotChannels.textChannels) {
                point.fields[`${textChannel.name}`] = textChannel.value;
            }
            points.push(point);
        }
        await this._influxClient.writeMeasurement(schema.measurement,
            points, {
                database: config.database,
                retentionPolicy: schema.retentionPolicy,
                precision: 's'
            });
    }
}

module.exports = InfluxDbClient;