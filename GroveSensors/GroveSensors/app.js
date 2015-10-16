var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GroveSensorCategory;
(function (GroveSensorCategory) {
    GroveSensorCategory[GroveSensorCategory["ANALOG"] = 0] = "ANALOG";
    GroveSensorCategory[GroveSensorCategory["DIGITAL"] = 1] = "DIGITAL";
    GroveSensorCategory[GroveSensorCategory["I2C"] = 2] = "I2C";
})(GroveSensorCategory || (GroveSensorCategory = {}));
var GroveSensor = (function () {
    //constructor
    function GroveSensor(cat, vcc) {
        this.VCC = vcc;
        this.category = cat;
        if (!this.VCC) {
            this.VCC = 5;
        }
    }
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
//# sourceMappingURL=app.js.map