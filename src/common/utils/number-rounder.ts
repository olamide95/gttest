export class NumberRounder {
    static round(value: number, fractionDigits: number = 2) {
        return Number.parseFloat(value.toFixed(fractionDigits));
    }
}
