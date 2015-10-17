export class GroveAnalogSensor {
    // Properties (public by default)

    // VCC is the voltage the circuit is operating at. For Grove sensors this can be either 3.3v or
    // 5 volts, and some sensors need this voltage known in order to correctly calculate their output
    VCC: number;

    // some Grove sensors have undergone revisions that impact the calculation of their values.
    // rather than having 3 different classes for 3 different versions of temperature sensors, using
    // this version property will allow for the correct formula to be used to compute temp
    version: number;

    analogPin: Intel.IoT.Aio;

    getSample(samplecount?: number) {
        var i: number;
        var sum: number;

        if (!samplecount) {
            samplecount = 10;
        } 

        sum = 0;

        for (i = 0; i < samplecount; i++) {
            sum += this.analogPin.read();

        }
        return sum / samplecount;
    }


    //constructor
    constructor(_pin: number, _version?: number, _vcc?: number) {
        this.version = _version;

        if (_version) {
            this.version = _version;
        } else {
            this.version = 1.0;
        }
        if (_vcc) {
            this.VCC = _vcc;
        } else {
            this.VCC = 5;
        }

        var m = require("mraa");
        this.analogPin = new m.Aio(_pin);



    }
}



export class GroveTemperature extends GroveAnalogSensor {
    // Properties (public by default)
    rawValue: number;
    private temperature: number;

    //constructor
    constructor(_pin: number, _version: number, _vcc?: number) {
        super(_pin, _version, _vcc)

    }

    getTemp(): number {
        return this.temperature;
    }

    update(): void {

        var a: number;

        a = this.getSample();

        if (this.version = 1.2) {
            var B = 4275;
            var R0 = 100000;

            var R: number;
            var t: number;

            R = 1023.0 / a - 1.0;
            R = 100000.0 * R;

            t = 1.0 / (log(R / 100000.0) / B + 1 / 298.15) - 273.15;    //convert to temperature via datasheet ;
 
            this.temperature = t;
        }






    }
}