var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
exports.GroveAnalogSensor = GroveAnalogSensor;
var GroveTemperature = (function (_super) {
    __extends(GroveTemperature, _super);
    //constructor
    function GroveTemperature(_pin, _version, _vcc) {
        _super.call(this, _pin, _version, _vcc);
    }
    GroveTemperature.prototype.getTemp = function () {
        return this.temperature;
    };
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
            t = 1.0 / (log(R / 100000.0) / B + 1 / 298.15) - 273.15; //convert to temperature via datasheet ;
            this.temperature = t;
        }
    };
    return GroveTemperature;
})(GroveAnalogSensor);
exports.GroveTemperature = GroveTemperature;
//# sourceMappingURL=grove-sensors.js.map