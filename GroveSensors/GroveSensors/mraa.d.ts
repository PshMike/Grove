declare module Intel.IoT {

    interface mraa { }

    interface Aio {
        new (pin: number): Aio;
        read(): number;
        readFloat(): number;


    }















}