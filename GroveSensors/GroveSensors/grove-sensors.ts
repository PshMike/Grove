export module MJGrove {

    class GroveAnalogSensor {
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
        constructor(_pin: Intel.IoT.Aio, _version?: number, _vcc?: number) {
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
        private _rawValue: number;
        private _temperature: number;

        //constructor
        constructor(_pin: Intel.IoT.Aio, _version: number, _vcc?: number) {
            super(_pin, _version, _vcc)

        }

        public get temperature(): number {
            return this._temperature;
        }

        public update(): void {

            var a: number;

            a = this.getSample();

            if (this.version = 1.2) {
                var B = 4275;
                var R0 = 100000;

                var R: number;
                var t: number;

                R = 1023.0 / a - 1.0;
                R = 100000.0 * R;

                t = 1.0 / (Math.log(R / 100000.0) / B + 1 / 298.15) - 273.15;    //convert to temperature via datasheet ;
 
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

        constructor(_pin: Intel.IoT.Aio, _version: number, _vcc?: number) {
            super(_pin, _version, _vcc);

            if (_version = 1) {
                this._FULLRANGE = 300;
            }

        }

        public get angle(): number {
            return this._angle;
        }

        public get voltage(): number {
            return this._voltage;}

        public get rawValue(): number {
            return this._rawValue;
        }

        public update(): void {

            var a: number;

            a = this.getSample();

            this._voltage = a * this.VCC / 1023;
            this._angle = a * 360 / 1023;
            this._rawValue = a;
        }




    }


}

