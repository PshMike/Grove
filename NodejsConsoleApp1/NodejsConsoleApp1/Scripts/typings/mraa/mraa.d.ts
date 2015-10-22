declare module mraa {

    enum Dir { DIR_OUT, DIR_IN, DIR_OUT_HIGH, DIR_OUT_LOW }

    interface Aio {
        new (pin: number): Aio;
        read(): number;
        readFloat(): number;


    }

    interface Gpio {
        new (pin: number): Gpio;
        dir(pin: mraa.Gpio, direction: mraa.Dir);
        read(): number;
        write(value: number);
    }
















}