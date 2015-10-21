export module MJGrove {

    class GroveAnalogSensor {
        // Properties

        // VCC is the voltage the circuit is operating at. For Grove sensors this can be either 3.3v or
        // 5 volts, and some sensors need this voltage known in order to correctly calculate their output
        private _vcc: number;

        // some Grove sensors have undergone revisions that impact the calculation of their values.
        // rather than having 3 different classes for 3 different versions of temperature sensors, using
        // this version property will allow for the correct formula to be used in sensor computations
        private _version: number;

        // TODO:
        // validate vcc values
        // validate pin values

        getSample(pin: Intel.IoT.Aio, samplecount?: number) {
            var i: number;
            var sum: number;

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
        }

        public get version(): number {
            return this._version;
        }

        public get vcc(): number {
            return this._vcc;
        }

        //constructor
        constructor(version = 1, vcc = 5) {

            this._version = version;
            this._vcc = vcc;
        }
    }

    export class GroveTemperature extends GroveAnalogSensor {
        // Properties (public by default)
        private _rawValue: number;
        private _temperature: number;
        private _pin: Intel.IoT.Aio;

        //constructor
        constructor(pin: Intel.IoT.Aio, version: number, vcc?: number) {
            super(version, vcc)

            this._pin = pin;

        }

        public get temperature(): number {
            return this._temperature;
        }

        public update(): void {

            var a: number;

            a = this.getSample(this._pin);

            if (this.version = 1.2) {
                var B = 4275;
                var R0 = 100000;

                var R: number;
                var t: number;

                R = 1023.0 / a - 1.0;
                R = 100000.0 * R;

                t = 1.0 / (Math.log(R / 100000.0) / B + 1 / 298.15) - 273.15;
 
                this._temperature = t;
            }
        }
    }

    export class GroveRotaryAngleSensor extends GroveAnalogSensor {
        // properties

        private _angle: number;
        private _voltage: number;
        private _rawValue: number;
        private _FULLRANGE: number;
        private _pin: Intel.IoT.Aio;

        constructor(pin: Intel.IoT.Aio, version: number, vcc?: number) {
            super(version, vcc);

            if (version = 1) {
                this._FULLRANGE = 300;
            }

            this._pin = pin;

        }

        public get angle(): number {
            return this._angle;
        }

        public get voltage(): number {
            return this._voltage;
        }

        public get rawValue(): number {
            return this._rawValue;
        }
    
        public update(): void {

            var a: number;

            a = this.getSample(this._pin);

            this._voltage = a * this.vcc / 1023;
            this._angle = a * this._FULLRANGE / 1023;
            this._rawValue = a;
        }
    }

    export class GroveLightSensor extends GroveAnalogSensor {
        private _value: number;

        constructor(pin: Intel.IoT.Aio, version: number, vcc: number) {
            super(version, vcc);
        }
    }
}

