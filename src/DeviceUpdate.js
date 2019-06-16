const flatbuffers = require("flatbuffers").flatbuffers;
const flatbufferDeviceUpdate = require("../flatbuffers/include/device_update_generated").logger.flatbuffer.DeviceUpdate;

/**
 * The classes in this file provide easier access to the flatbuffer models
 * and make it easy to convert them to JSON
 */

class SpotChannelNumeric {
    /**
     *
     * @param {logger.flatbuffer.SpotChannelNumeric} spotChannelNumeric
     */
    constructor(spotChannelNumeric) {
        this._spotChannelNumeric = spotChannelNumeric;
    }

    /**
     *
     * @return {string}
     */
    get name() {
        return this._spotChannelNumeric.name();
    }

    /**
     *
     * @return {number}
     */
    get value() {
        return this._spotChannelNumeric.value();
    }

    /**
     *
     * @return {string}
     */
    get unit() {
        return this._spotChannelNumeric.unit();
    }

    toJSON() {
        return {
            name: this.name,
            value: this.value,
            unit: this.unit
        }
    }
}

class SpotChannelText {
    /**
     *
     * @param {logger.flatbuffer.SpotChannelText} spotChannelText
     */
    constructor(spotChannelText) {
        this._spotChannelText = spotChannelText;
    }
    /**
     *
     * @return {string}
     */
    get name() {
        return this._spotChannelText.name();
    }

    /**
     *
     * @return {string}
     */
    get value() {
        return this._spotChannelText.value();
    }

    toJSON() {
        return {
            name: this.name,
            value: this.value
        }
    }
}

class SpotChannels {
    /**
     *
     * @param {logger.flatbuffer.SpotChannels} spotChannels
     */
    constructor(spotChannels) {
        this._spotChannels = spotChannels;
    }

    /**
     * Unix timestamp (seconds) of the spot channel values
     * @return {number}
     */
    get timestamp() {
        return this._spotChannels.timestamp();
    }

    /**
     *
     * @return {IterableIterator<SpotChannelNumeric>}
     */
    get numericChannels() {
        const spotChannels = this._spotChannels;
        return {
            * [Symbol.iterator]() {
                for(let i = 0; i < spotChannels.numericLength(); i++) {
                    yield new SpotChannelNumeric(spotChannels.numeric(i));
                }
            }
        };
    }

    /**
     *
     * @return {IterableIterator<SpotChannelText>}
     */
    get textChannels() {
        const spotChannels = this._spotChannels;
        return {
            * [Symbol.iterator]() {
                for(let i = 0; i < spotChannels.textLength(); i++) {
                    yield new SpotChannelText(spotChannels.text(i));
                }
            }
        };
    }

    toJSON() {
        const json = {
            timestamp: this.timestamp,
            numeric: [],
            text: []
        };
        for (const numericChannel of this.numericChannels) {
            json.numeric.push(numericChannel.toJSON());
        }
        for (const textChannel of this.textChannels) {
            json.text.push(textChannel.toJSON());
        }
        return json;
    }
}

class DeviceUpdate {
    constructor(buffer) {
        this._deviceUpdate = flatbufferDeviceUpdate.getRootAsDeviceUpdate(
            new flatbuffers.ByteBuffer(new Uint8Array(buffer))
        );
    }

    /**
     *
     * @return {string}
     */
    get name() {
        return this._deviceUpdate.name();
    }

    /**
     *
     * @return {string}
     */
    get type() {
        return this._deviceUpdate.type();
    }

    /**
     *
     * @return {number}
     */
    get serialNumber() {
        return this._deviceUpdate.serialNumber();
    }

    /**
     *
     * @return {IterableIterator<SpotChannels>}
     */
    get spotChannels() {
        const deviceUpdate = this._deviceUpdate;
        return {
            * [Symbol.iterator]() {
                for (let i = 0; i < deviceUpdate.spotChannelsLength(); i++) {
                    yield new SpotChannels(deviceUpdate._spotChannels(i));
                }
            }
        };
    }

    toJSON() {
        const json = {
            name: this.name,
            type: this.type,
            serialNumber: this.serialNumber,
            spotChannels: []
        };
        for (const spotChannels of this.spotChannels) {
            json.spotChannels.push(spotChannels.toJSON());
        }
        return json;
    }
}

module.exports = DeviceUpdate;