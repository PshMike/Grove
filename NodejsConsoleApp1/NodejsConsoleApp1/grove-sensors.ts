export module MyGrove {
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

        getSample(pin: Intel.IoT.Aio, samplecount = 1) {
            var i: number;
            var sum: number;

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
        private _pin: Intel.IoT.Aio;

        constructor(pin: Intel.IoT.Aio, version: number, vcc: number) {
            super(version, vcc);

            this._pin = pin;
        }

        public get value(): number {
            return this._value;
        }

        public update(): void {

            var a: number;

            a = this.getSample(this._pin);

            this._value = a;
        }
    }

    export class GroveSoundSensor extends GroveAnalogSensor {
        private _value: number;
        private _pin: Intel.IoT.Aio;

        constructor(pin: Intel.IoT.Aio, version: number, vcc: number) {
            super(version, vcc);
        }

        public get value(): number {
            return this._value;
        }

        public update(): void {

            var a: number;
            a = this.getSample(this._pin);

            this._value = a;
        }
    }

    export class GroveHighTempSensor extends GroveAnalogSensor {
        private _pinAmbient: Intel.IoT.Aio;
        private _pinThmc: Intel.IoT.Aio;
        private _tempThmc: number;
        private _tempAmbient: number;
        private _rawAmbient: number;
        private _rawThmc: number;
        private _voltage: number;

        private static VOL_OFFSET: number = 350;
        private static AMP_AV: number = 54.16;

        constructor(pinAmbient: Intel.IoT.Aio, pinThmc: Intel.IoT.Aio, version: number, vcc: number) {
            super(version, vcc);

            this._pinAmbient = pinAmbient;
            this._pinThmc = pinThmc;

        }

        public get rawAmbient(): number {
            return this._rawAmbient;
        }

        public get rawThmc(): number {
            return this._rawThmc;
        }

        private UpdateAmbient(): void {

            var a: number;
            var resistance: number;
            var temp: number;

            a = this._rawAmbient * 50 / 33;

            resistance = (1023 - a) * 10000 / a;
            temp = 1 / (Math.log(resistance / 10000) / 3975 + 1 / 298.15) - 273.15;

            this._tempAmbient = temp;
        }

        public update(): void {

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

            var i: number = 0;
            var value: number = 0;

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

        }
    }
}









