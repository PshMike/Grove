var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MJGrove;
(function (MJGrove) {
    var GroveAnalogSensor = (function () {
        //constructor
        function GroveAnalogSensor(version, vcc) {
            if (version === void 0) { version = 1; }
            if (vcc === void 0) { vcc = 5; }
            this._version = version;
            this._vcc = vcc;
        }
        // TODO:
        // validate vcc values
        // validate pin values
        GroveAnalogSensor.prototype.getSample = function (pin, samplecount) {
            var i;
            var sum;
            if (!samplecount) {
                samplecount = 1;
            }
            var m = require("mraa");
            var analogPin = new m.Aio(pin);
            sum = 0;
            for (i = 0; i < samplecount; i++) {
                sum += analogPin.read();
            }
            return sum / samplecount;
        };
        Object.defineProperty(GroveAnalogSensor.prototype, "version", {
            get: function () {
                return this._version;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GroveAnalogSensor.prototype, "vcc", {
            get: function () {
                return this._vcc;
            },
            enumerable: true,
            configurable: true
        });
        return GroveAnalogSensor;
    })();
    var GroveTemperature = (function (_super) {
        __extends(GroveTemperature, _super);
        //constructor
        function GroveTemperature(pin, version, vcc) {
            _super.call(this, version, vcc);
            this._pin = pin;
        }
        Object.defineProperty(GroveTemperature.prototype, "temperature", {
            get: function () {
                return this._temperature;
            },
            enumerable: true,
            configurable: true
        });
        GroveTemperature.prototype.update = function () {
            var a;
            a = this.getSample(this._pin);
            if (this.version = 1.2) {
                var B = 4275;
                var R0 = 100000;
                var R;
                var t;
                R = 1023.0 / a - 1.0;
                R = 100000.0 * R;
                t = 1.0 / (Math.log(R / 100000.0) / B + 1 / 298.15) - 273.15;
                this._temperature = t;
            }
        };
        return GroveTemperature;
    })(GroveAnalogSensor);
    MJGrove.GroveTemperature = GroveTemperature;
    var GroveRotaryAngleSensor = (function (_super) {
        __extends(GroveRotaryAngleSensor, _super);
        function GroveRotaryAngleSensor(_pin, _version, _vcc) {
            _super.call(this, _version, _vcc);
            if (_version = 1) {
                this._FULLRANGE = 300;
            }
            this._pin = _pin;
        }
        Object.defineProperty(GroveRotaryAngleSensor.prototype, "angle", {
            get: function () {
                return this._angle;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GroveRotaryAngleSensor.prototype, "voltage", {
            get: function () {
                return this._voltage;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GroveRotaryAngleSensor.prototype, "rawValue", {
            get: function () {
                return this._rawValue;
            },
            enumerable: true,
            configurable: true
        });
        GroveRotaryAngleSensor.prototype.update = function () {
            var a;
            a = this.getSample(this._pin);
            this._voltage = a * this.vcc / 1023;
            this._angle = a * this._FULLRANGE / 1023;
            this._rawValue = a;
        };
        return GroveRotaryAngleSensor;
    })(GroveAnalogSensor);
    MJGrove.GroveRotaryAngleSensor = GroveRotaryAngleSensor;
    var GroveLightSensor = (function (_super) {
        __extends(GroveLightSensor, _super);
        function GroveLightSensor(pin, version, vcc) {
            _super.call(this, version, vcc);
        }
        return GroveLightSensor;
    })(GroveAnalogSensor);
    MJGrove.GroveLightSensor = GroveLightSensor;
})(MJGrove = exports.MJGrove || (exports.MJGrove = {}));
//# sourceMappingURL=grove-sensors.js.map