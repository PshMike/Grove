var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MJGrove;
(function (MJGrove) {
    var GroveAnalogSensor = (function () {
        //constructor
        function GroveAnalogSensor(_pin, _version, _vcc) {
            this.version = _version;
            if (_version) {
                this.version = _version;
            }
            else {
                this.version = 1.0;
            }
            if (_vcc) {
                this.VCC = _vcc;
            }
            else {
                this.VCC = 5;
            }
            var m = require("mraa");
            this.analogPin = new m.Aio(_pin);
        }
        GroveAnalogSensor.prototype.getSample = function (samplecount) {
            var i;
            var sum;
            if (!samplecount) {
                samplecount = 10;
            }
            sum = 0;
            for (i = 0; i < samplecount; i++) {
                sum += this.analogPin.read();
            }
            return sum / samplecount;
        };
        return GroveAnalogSensor;
    })();
    var GroveTemperature = (function (_super) {
        __extends(GroveTemperature, _super);
        //constructor
        function GroveTemperature(_pin, _version, _vcc) {
            _super.call(this, _pin, _version, _vcc);
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
            a = this.getSample();
            if (this.version = 1.2) {
                var B = 4275;
                var R0 = 100000;
                var R;
                var t;
                R = 1023.0 / a - 1.0;
                R = 100000.0 * R;
                t = 1.0 / (Math.log(R / 100000.0) / B + 1 / 298.15) - 273.15; //convert to temperature via datasheet ;
                this._temperature = t;
            }
        };
        return GroveTemperature;
    })(GroveAnalogSensor);
    MJGrove.GroveTemperature = GroveTemperature;
    var GroveRotaryAngleSensor = (function (_super) {
        __extends(GroveRotaryAngleSensor, _super);
        function GroveRotaryAngleSensor(_pin, _version, _vcc) {
            _super.call(this, _pin, _version, _vcc);
            if (_version = 1) {
                this._FULLRANGE = 300;
            }
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
            a = this.getSample();
            this._voltage = a * this.VCC / 1023;
            this._angle = a * 360 / 1023;
            this._rawValue = a;
        };
        return GroveRotaryAngleSensor;
    })(GroveAnalogSensor);
    MJGrove.GroveRotaryAngleSensor = GroveRotaryAngleSensor;
})(MJGrove = exports.MJGrove || (exports.MJGrove = {}));
//# sourceMappingURL=grove-sensors.js.map