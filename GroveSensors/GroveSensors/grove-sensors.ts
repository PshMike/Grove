export enum GroveSensorCategory { ANALOG, DIGITAL, I2C }

export class GroveSensor {
    // Properties (public by default)

    VCC: number;
    category: GroveSensorCategory;

    AnalogSample(pin: number,samplecount?: number) {
        var i: number;
        var sum: number;

        if (!samplecount) {
            samplecount = 10;
        } 

        sum = 0;

        for (i = 0; i < samplecount; i++) {
            sum += AnalogRead(pin);

        }

        return sum / samplecount;




    }


    //constructor
    constructor(cat: GroveSensorCategory, vcc?: number) {
        this.VCC = vcc;
        this.category = cat;

        if (!this.VCC) {
            this.VCC = 5;
        }
    }
    
    
}

export class GroveTemp extends GroveSensor {
    // Properties (public by default)
    version: number;

    analogPin: number;

    //constructor
    constructor(pin: number, VCC: number) {
        super(VCC,GroveSensorCategory.ANALOG);
        this.analogPin = pin;
    }


}