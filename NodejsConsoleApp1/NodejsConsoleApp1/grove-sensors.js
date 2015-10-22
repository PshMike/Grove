var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MyGrove;
(function (MyGrove) {
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
            if (samplecount === void 0) { samplecount = 1; }
            var i;
            var sum;
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
    MyGrove.GroveTemperature = GroveTemperature;
    var GroveRotaryAngleSensor = (function (_super) {
        __extends(GroveRotaryAngleSensor, _super);
        function GroveRotaryAngleSensor(pin, version, vcc) {
            _super.call(this, version, vcc);
            if (version = 1) {
                this._FULLRANGE = 300;
            }
            this._pin = pin;
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
    MyGrove.GroveRotaryAngleSensor = GroveRotaryAngleSensor;
    var GroveLightSensor = (function (_super) {
        __extends(GroveLightSensor, _super);
        function GroveLightSensor(pin, version, vcc) {
            _super.call(this, version, vcc);
            this._pin = pin;
        }
        Object.defineProperty(GroveLightSensor.prototype, "value", {
            get: function () {
                return this._value;
            },
            enumerable: true,
            configurable: true
        });
        GroveLightSensor.prototype.update = function () {
            var a;
            a = this.getSample(this._pin);
            this._value = a;
        };
        return GroveLightSensor;
    })(GroveAnalogSensor);
    MyGrove.GroveLightSensor = GroveLightSensor;
    var GroveSoundSensor = (function (_super) {
        __extends(GroveSoundSensor, _super);
        function GroveSoundSensor(pin, version, vcc) {
            _super.call(this, version, vcc);
        }
        Object.defineProperty(GroveSoundSensor.prototype, "value", {
            get: function () {
                return this._value;
            },
            enumerable: true,
            configurable: true
        });
        GroveSoundSensor.prototype.update = function () {
            var a;
            a = this.getSample(this._pin);
            this._value = a;
        };
        return GroveSoundSensor;
    })(GroveAnalogSensor);
    MyGrove.GroveSoundSensor = GroveSoundSensor;
    var GroveHighTempSensor = (function (_super) {
        __extends(GroveHighTempSensor, _super);
        function GroveHighTempSensor(pinAmbient, pinThmc, version, vcc) {
            _super.call(this, version, vcc);
            this._pinAmbient = pinAmbient;
            this._pinThmc = pinThmc;
        }
        Object.defineProperty(GroveHighTempSensor.prototype, "rawAmbient", {
            get: function () {
                return this._rawAmbient;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GroveHighTempSensor.prototype, "rawThmc", {
            get: function () {
                return this._rawThmc;
            },
            enumerable: true,
            configurable: true
        });
        GroveHighTempSensor.prototype.UpdateAmbient = function () {
            var a;
            var resistance;
            var temp;
            a = this._rawAmbient * 50 / 33;
            resistance = (1023 - a) * 10000 / a;
            temp = 1 / (Math.log(resistance / 10000) / 3975 + 1 / 298.15) - 273.15;
            this._tempAmbient = temp;
        };
        GroveHighTempSensor.prototype.update = function () {
            // read analog pins
            this._rawAmbient = this.getSample(this._pinAmbient);
            this._rawThmc = this.getSample(this._pinThmc);
            this.UpdateAmbient();
            // get voltage of thmc
            this._voltage = ((this._rawThmc / 1023.0 * 5.0 * 1000) - GroveHighTempSensor.VOL_OFFSET) / GroveHighTempSensor.AMP_AV;
            // convert voltage to K
            var Var_VtoT_K = [[0, 2.5173462e1, -1.1662878, -1.0833638, -8.9773540 / 1e1, -3.7342377 / 1e1, -8.6632643 / 1e2, -1.0450598 / 1e2, -5.1920577 / 1e4],
                [0, 2.508355e1, 7.860106 / 1e2, -2.503131 / 1e1, 8.315270 / 1e2, -1.228034 / 1e2, 9.804036 / 1e4, -4.413030 / 1e5, 1.057734 / 1e6, -1.052755 / 1e8],
                [-1.318058e2, 4.830222e1, -1.646031, 5.464731 / 1e2, -9.650715 / 1e4, 8.802193 / 1e6, -3.110810 / 1e8]
            ];
            var i = 0;
            var value = 0;
            if (this._voltage >= -6.478 && this._voltage < 0) {
                value = Var_VtoT_K[0][8];
                for (i = 8; i > 0; i--)
                    value = this._voltage * value + Var_VtoT_K[0][i - 1];
            }
            else if (this._voltage >= 0 && this._voltage < 20.644) {
                value = Var_VtoT_K[1][9];
                for (i = 9; i > 0; i--) {
                    value = this._voltage * value + Var_VtoT_K[1][i - 1];
                }
            }
            else if (this._voltage >= 20.644 && this._voltage <= 54.900) {
                value = Var_VtoT_K[2][6];
                for (i = 6; i > 0; i--)
                    value = this._voltage * value + Var_VtoT_K[2][i - 1];
            }
            // update private members
            this._tempThmc = value + this._tempAmbient;
        };
        GroveHighTempSensor.VOL_OFFSET = 350;
        GroveHighTempSensor.AMP_AV = 54.16;
        return GroveHighTempSensor;
    })(GroveAnalogSensor);
    MyGrove.GroveHighTempSensor = GroveHighTempSensor;
})(MyGrove = exports.MyGrove || (exports.MyGrove = {}));
