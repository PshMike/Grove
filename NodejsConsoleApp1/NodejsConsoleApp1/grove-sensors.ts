export module MyGrove {

    enum relayState { open, closed };


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


        // this method placed in this base class so it is available to all analog sensors derived from this base class
        // this method is meant to account of random "blips" when doing analog pin reads by taking a larger sample and
        // then returning the average

        // TODO: come up with a way look at the sampled values and "discard" any wild outliers
        getSample(pin: mraa.Aio, samplecount = 1) {
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

        // begin public Accessors
        public get version(): number {
            return this._version;
        }

        public get vcc(): number {
            return this._vcc;
        }
        // end public Accessors


        //constructor
        // putting the default values in the constructor call makes both params optional
        constructor(version = 1, vcc = 5) {

            this._version = version;
            this._vcc = vcc;
        }
    }

    export class GroveTemperature extends GroveAnalogSensor {
        // Properties (public by default)
        private _rawValue: number;
        private _temperature: number;
        private _pin: mraa.Aio;

        //constructor
        constructor(pin: mraa.Aio, version: number, vcc?: number) {
            super(version, vcc)

            this._pin = pin;

        }

        public get temperature(): number {
            return this._temperature;
        }

        public update(sampleSize: number = 1): void {

            // the url below was used to create compute temperature for v1.2 sensors
            // http://www.seeedstudio.com/wiki/Grove_-_Temperature_Sensor_V1.2

            var a: number;

            a = this.getSample(this._pin,sampleSize);

            if (this.version = 1.2) {
                var B = 4275;

                var R: number;
                var t: number;

                R = (1023.0 / a - 1.0) * 100000.0;

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
        private _pin: mraa.Aio;

        constructor(pin: mraa.Aio, version: number, vcc?: number) {
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

        public update(sampleSize: number =1): void {

            var a: number;

            a = this.getSample(this._pin,sampleSize);

            this._voltage = a * this.vcc / 1023;
            this._angle = a * this._FULLRANGE / 1023;
            this._rawValue = a;
        }
    }

    export class GroveLightSensor extends GroveAnalogSensor {
        private _value: number;
        private _pin: mraa.Aio;

        constructor(pin: mraa.Aio, version: number, vcc: number) {
            super(version, vcc);

            this._pin = pin;
        }

        public get value(): number {
            return this._value;
        }

        public update(sampleSize: number =1): void {

            var a: number;

            a = this.getSample(this._pin,sampleSize);

            this._value = a;
        }
    }

    export class GroveSoundSensor extends GroveAnalogSensor {
        private _value: number;
        private _pin: mraa.Aio;

        constructor(pin: mraa.Aio, version: number, vcc: number) {
            super(version, vcc);
        }

        public get value(): number {
            return this._value;
        }

        public update(sampleSize: number = 1): void {

            var a: number;
            a = this.getSample(this._pin,sampleSize);

            this._value = a;
        }
    }

    export class GroveHighTempSensor extends GroveAnalogSensor {
        private _pinAmbient: mraa.Aio;
        private _pinThmc: mraa.Aio;
        private _tempThmc: number;
        private _tempAmbient: number;
        private _rawAmbient: number;
        private _rawThmc: number;
        private _voltage: number;

        private VOL_OFFSET: number;
        private AMP_AV: number;

        constructor(pinAmbient: mraa.Aio, pinThmc: mraa.Aio, version: number, vcc: number) {
            super(version, vcc);

            if (version = 1) {
                this.VOL_OFFSET = 350;
                this.AMP_AV = 54.16;
                }

            this._pinAmbient = pinAmbient;
            this._pinThmc = pinThmc;

        }

        public get rawAmbient(): number {
            return this._rawAmbient;
        }

        public get rawThmc(): number {
            return this._rawThmc;
        }

        public get tempAmbient(): number {
            return this._tempAmbient;
        }

        public get tempThmc(): number {
            return this._tempThmc;
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

        public update(n: number = 1): void {

            // read analog pins

            this._rawAmbient = this.getSample(this._pinAmbient,n);
            this._rawThmc = this.getSample(this._pinThmc,n);

            this.UpdateAmbient();
            
            // get voltage of thmc
            this._voltage = ((this._rawThmc / 1023.0 * 5.0 * 1000) - this.VOL_OFFSET ) / this.AMP_AV;

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

    export class GroveRelay {

        private state: relayState;
        private digitalPin: mraa.Gpio;
        private version: number;

        // constructor
        constructor(pin: mraa.Gpio, version: number = 1) {

            var m = require('mraa');

            this.digitalPin = m.Gpio(pin);

            m.


            this.version = version;

            this.state = relayState.open;
            
        }

        public Open() {
            this.digitalPin.write(0);
            this.state = relayState.open;
        }

        public Close() {
            this.digitalPin.write(1);
            this.state = relayState.closed
        }

    }
}









