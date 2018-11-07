import { InputManager } from './input.manager';

export class InputService {

    private inputManager: InputManager;

    constructor(private htmlInputElement: any, private options: any) {
        this.inputManager = new InputManager(htmlInputElement);
    }

    addNumber(keyCode: number): void {
        const { decimal, prefix } = this.options;
        const keyChar = String.fromCharCode(keyCode);
        const selectionStart = this.inputSelection.selectionStart;
        const selectionEnd = this.inputSelection.selectionEnd;

        if (!this.rawValue) {
            if (keyChar === decimal) {
                this.rawValue = this.applyMask(false, '0');
            } else {
                this.rawValue = this.applyMask(false, keyChar + decimal + '0');
            }
            this.updateFieldValue(prefix.length + 1);
        } else {
            if (keyChar === decimal) {
                this.rawValue = this.insertKeyChar(keyChar, selectionStart, selectionEnd);
                this.updateFieldValue(0);
                const decimalPos = this.rawValue.indexOf(decimal);
                this.updateFieldValue(decimalPos + 1);
            } else {
                const decimalPos = this.rawValue.indexOf(decimal);
                this.rawValue = this.insertKeyChar(keyChar, selectionStart, selectionEnd);
                this.updateFieldValue(selectionStart + ((selectionStart <= decimalPos) ? 1 : 2));
            }
        }
    }

    insertKeyChar(keyChar: string, selectionStart: number, selectionEnd: number): string {
        return this.rawValue.substring(0, selectionStart) + keyChar + this.rawValue.substring(selectionEnd, this.rawValue.length);
    }

    applyMask(isNumber: boolean, rawValue: string): string {
        const { allowNegative, decimal, precision, prefix, suffix, thousands } = this.options;

        const thousandsRegex = new RegExp(thousands === '.' ? '\\.' : thousands, 'g');
        const decimalRegex = new RegExp(decimal === '.' ? '\\.' : decimal, 'g');

        if (isNumber) {
            rawValue = new Number(rawValue).toFixed(precision).replace(thousandsRegex, decimal);
        }

        const onlyNumbers = rawValue.replace(new RegExp('[^0-9(' + decimal + ')]', 'g'), '');
        if (!onlyNumbers) {
            return '';
        }

        const decimalPos = onlyNumbers.indexOf(decimal);
        let integerPart = onlyNumbers.slice(0, decimalPos).replace(/^0*/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
        let decimalPart = onlyNumbers.slice(decimalPos).replace(decimalRegex, '');

        if (integerPart === '') {
            integerPart = '0';
        }

        let newRawValue = integerPart;

        if (precision > 0) {
            if (precision - decimalPart.length > 0) {
                decimalPart = decimalPart + '0'.repeat(precision - decimalPart.length);
            }
            newRawValue += decimal + decimalPart.slice(0, precision);
        }

        const isZero = parseInt(integerPart) === 0 && (parseInt(decimalPart) === 0 || decimalPart === '');
        const operator = (rawValue.indexOf('-') > -1 && allowNegative && !isZero) ? '-' : '';
        return operator + prefix + newRawValue + suffix;


    }

    clearMask(rawValue: string): number {
        if (rawValue == null || rawValue === '') {
            return null;
        }

        let value = rawValue.replace(this.options.prefix, '').replace(this.options.suffix, '');

        if (this.options.thousands) {
            value = value.replace(new RegExp('\\' + this.options.thousands, 'g'), '');
        }

        if (this.options.decimal) {
            value = value.replace(this.options.decimal, '.');
        }

        return parseFloat(value);
    }

    changeToNegative(): void {
        if (this.options.allowNegative && this.rawValue !== '' && this.rawValue.charAt(0) !== '-' && this.value !== 0) {
            const selectionStart = this.inputSelection.selectionStart;
            this.rawValue = '-' + this.rawValue;
            this.updateFieldValue(selectionStart + 1);
        }
    }

    changeToPositive(): void {
        const selectionStart = this.inputSelection.selectionStart;
        this.rawValue = this.rawValue.replace('-', '');
        this.updateFieldValue(selectionStart - 1);
    }

    fixCursorPosition(forceToEndPosition?: boolean): void {
        const currentCursorPosition = this.inputSelection.selectionStart;

        // if the current cursor position is after the number end position, it is moved to the end of the number, ignoring the prefix or suffix. this behavior can be forced with forceToEndPosition flag
        if (currentCursorPosition > this.getRawValueWithoutSuffixEndPosition() || forceToEndPosition) {
            this.inputManager.setCursorAt(this.getRawValueWithoutSuffixEndPosition());
            // if the current cursor position is before the number start position, it is moved to the start of the number, ignoring the prefix or suffix
        } else if (currentCursorPosition < this.getRawValueWithoutPrefixStartPosition()) {
            this.inputManager.setCursorAt(this.getRawValueWithoutPrefixStartPosition());
        }
    }

    getRawValueWithoutSuffixEndPosition(): number {
        return this.rawValue.length - this.options.suffix.length;
    }

    getRawValueWithoutPrefixStartPosition(): number {
        return this.value != null && this.value < 0 ? this.options.prefix.length + 1 : this.options.prefix.length;
    }

    removeNumber(keyCode: number): void {
        const { decimal, thousands } = this.options;
        let selectionEnd = this.inputSelection.selectionEnd;
        let selectionStart = this.inputSelection.selectionStart;

        if (selectionStart > this.rawValue.length - this.options.suffix.length) {
            selectionEnd = this.rawValue.length - this.options.suffix.length;
            selectionStart = this.rawValue.length - this.options.suffix.length;
        }

        // there is no selection
        if (selectionEnd === selectionStart) {
            // delete key and the target digit is a number
            if ((keyCode === 46 || keyCode === 63272) && /^\d+$/.test(this.rawValue.substring(selectionStart, selectionEnd + 1))) {
                selectionEnd = selectionEnd + 1;
            }

            // delete key and the target digit is the decimal or thousands divider
            if ((keyCode === 46 || keyCode === 63272) && (this.rawValue.substring(selectionStart, selectionEnd + 1) === decimal || this.rawValue.substring(selectionStart, selectionEnd + 1) === thousands)) {
                selectionEnd = selectionEnd + 2;
                selectionStart = selectionStart + 1;
            }

            // backspace key and the target digit is a number
            if (keyCode === 8 && /^\d+$/.test(this.rawValue.substring(selectionStart - 1, selectionEnd))) {
                selectionStart = selectionStart - 1;
            }

            // backspace key and the target digit is the decimal or thousands divider
            if (keyCode === 8 && (this.rawValue.substring(selectionStart - 1, selectionEnd) === decimal || this.rawValue.substring(selectionStart - 1, selectionEnd) === thousands)) {
                selectionStart = selectionStart - 2;
                selectionEnd = selectionEnd - 1;
            }
        }

        this.rawValue = this.rawValue.substring(0, selectionStart) + this.rawValue.substring(selectionEnd, this.rawValue.length);
        this.updateFieldValue(selectionStart);
    }

    updateFieldValue(selectionStart?: number): void {
        const newRawValue = this.applyMask(false, this.rawValue || '');
        selectionStart = selectionStart === undefined ? this.rawValue.length : selectionStart;
        this.inputManager.updateValueAndCursor(newRawValue, this.rawValue.length, selectionStart);
    }

    updateOptions(options: any): void {
        const value: number = this.value;
        this.options = options;
        this.value = value;
    }

    get canInputMoreNumbers(): boolean {
        return this.inputManager.canInputMoreNumbers;
    }

    get inputSelection(): any {
        return this.inputManager.inputSelection;
    }

    get rawValue(): string {
        return this.inputManager.rawValue;
    }

    set rawValue(value: string) {
        this.inputManager.rawValue = value;
    }

    get storedRawValue(): string {
        return this.inputManager.storedRawValue;
    }

    get value(): number {
        return this.clearMask(this.rawValue);
    }

    set value(value: number) {
        this.rawValue = this.applyMask(!!value && !isNaN(value), !!value ? '' + value : '');
    }
}
