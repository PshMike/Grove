var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (GroveSensorCategory) {
    GroveSensorCategory[GroveSensorCategory["ANALOG"] = 0] = "ANALOG";
    GroveSensorCategory[GroveSensorCategory["DIGITAL"] = 1] = "DIGITAL";
    GroveSensorCategory[GroveSensorCategory["I2C"] = 2] = "I2C";
})(exports.GroveSensorCategory || (exports.GroveSensorCategory = {}));
var GroveSensorCategory = exports.GroveSensorCategory;
var GroveSensor = (function () {
    //constructor
    function GroveSensor(cat, vcc) {
        this.VCC = vcc;
        this.category = cat;
        if (!this.VCC) {
            this.VCC = 5;
        }
    }
    GroveSensor.prototype.AnalogSample = function (pin, samplecount) {
        var i;
        var sum;
        if (!samplecount) {
            samplecount = 10;
        }
        sum = 0;
        for (i = 0; i < samplecount; i++) {
            sum += AnalogRead(pin);
        }
        return sum / samplecount;
    };
    return GroveSensor;
})();
exports.GroveSensor = GroveSensor;
var GroveTemp = (function (_super) {
    __extends(GroveTemp, _super);
    //constructor
    function GroveTemp(pin, VCC) {
        _super.call(this, VCC, GroveSensorCategory.ANALOG);
        this.analogPin = pin;
    }
    return GroveTemp;
})(GroveSensor);
exports.GroveTemp = GroveTemp;
//# sourceMappingURL=GroveSensors.js.map