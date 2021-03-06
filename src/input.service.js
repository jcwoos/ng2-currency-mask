"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var input_manager_1 = require("./input.manager");
var InputService = /** @class */ (function () {
    function InputService(htmlInputElement, options) {
        this.htmlInputElement = htmlInputElement;
        this.options = options;
        this.inputManager = new input_manager_1.InputManager(htmlInputElement);
    }
    InputService.prototype.addNumber = function (keyCode) {
        var _a = this.options, decimal = _a.decimal, prefix = _a.prefix;
        var keyChar = String.fromCharCode(keyCode);
        var selectionStart = this.inputSelection.selectionStart;
        var selectionEnd = this.inputSelection.selectionEnd;
        if (!this.rawValue) {
            if (keyChar === decimal) {
                this.rawValue = this.applyMask(false, '0');
            }
            else {
                this.rawValue = this.applyMask(false, keyChar + decimal + '0');
            }
            this.updateFieldValue(prefix.length + 1);
        }
        else {
            if (keyChar === decimal) {
                this.rawValue = this.insertKeyChar(keyChar, selectionStart, selectionEnd);
                this.updateFieldValue(0);
                var decimalPos = this.rawValue.indexOf(decimal);
                this.updateFieldValue(decimalPos + 1);
            }
            else {
                var decimalPos = this.rawValue.indexOf(decimal);
                this.rawValue = this.insertKeyChar(keyChar, selectionStart, selectionEnd);
                this.updateFieldValue(selectionStart + ((selectionStart <= decimalPos) ? 1 : 2));
            }
        }
    };
    InputService.prototype.insertKeyChar = function (keyChar, selectionStart, selectionEnd) {
        return this.rawValue.substring(0, selectionStart) + keyChar + this.rawValue.substring(selectionEnd, this.rawValue.length);
    };
    InputService.prototype.applyMask = function (isNumber, rawValue) {
        var _a = this.options, allowNegative = _a.allowNegative, decimal = _a.decimal, precision = _a.precision, prefix = _a.prefix, suffix = _a.suffix, thousands = _a.thousands;
        var thousandsRegex = new RegExp(thousands === '.' ? '\\.' : thousands, 'g');
        var decimalRegex = new RegExp(decimal === '.' ? '\\.' : decimal, 'g');
        if (isNumber) {
            rawValue = new Number(rawValue).toFixed(precision).replace(thousandsRegex, decimal);
        }
        var onlyNumbers = rawValue.replace(new RegExp('[^0-9(' + decimal + ')]', 'g'), '');
        if (!onlyNumbers) {
            return '';
        }
        var decimalPos = onlyNumbers.indexOf(decimal);
        var integerPart = onlyNumbers.slice(0, decimalPos).replace(/^0*/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
        var decimalPart = onlyNumbers.slice(decimalPos).replace(decimalRegex, '');
        if (integerPart === '') {
            integerPart = '0';
        }
        var newRawValue = integerPart;
        if (precision > 0) {
            if (precision - decimalPart.length > 0) {
                decimalPart = decimalPart + '0'.repeat(precision - decimalPart.length);
            }
            newRawValue += decimal + decimalPart.slice(0, precision);
        }
        var isZero = parseInt(integerPart) === 0 && (parseInt(decimalPart) === 0 || decimalPart === '');
        var operator = (rawValue.indexOf('-') > -1 && allowNegative && !isZero) ? '-' : '';
        return operator + prefix + newRawValue + suffix;
    };
    InputService.prototype.clearMask = function (rawValue) {
        if (rawValue == null || rawValue === '') {
            return null;
        }
        var value = rawValue.replace(this.options.prefix, '').replace(this.options.suffix, '');
        if (this.options.thousands) {
            value = value.replace(new RegExp('\\' + this.options.thousands, 'g'), '');
        }
        if (this.options.decimal) {
            value = value.replace(this.options.decimal, '.');
        }
        return parseFloat(value);
    };
    InputService.prototype.changeToNegative = function () {
        if (this.options.allowNegative && this.rawValue !== '' && this.rawValue.charAt(0) !== '-' && this.value !== 0) {
            var selectionStart = this.inputSelection.selectionStart;
            this.rawValue = '-' + this.rawValue;
            this.updateFieldValue(selectionStart + 1);
        }
    };
    InputService.prototype.changeToPositive = function () {
        var selectionStart = this.inputSelection.selectionStart;
        this.rawValue = this.rawValue.replace('-', '');
        this.updateFieldValue(selectionStart - 1);
    };
    InputService.prototype.fixCursorPosition = function (forceToEndPosition) {
        var currentCursorPosition = this.inputSelection.selectionStart;
        // if the current cursor position is after the number end position, it is moved to the end of the number, ignoring the prefix or suffix. this behavior can be forced with forceToEndPosition flag
        if (currentCursorPosition > this.getRawValueWithoutSuffixEndPosition() || forceToEndPosition) {
            this.inputManager.setCursorAt(this.getRawValueWithoutSuffixEndPosition());
            // if the current cursor position is before the number start position, it is moved to the start of the number, ignoring the prefix or suffix
        }
        else if (currentCursorPosition < this.getRawValueWithoutPrefixStartPosition()) {
            this.inputManager.setCursorAt(this.getRawValueWithoutPrefixStartPosition());
        }
    };
    InputService.prototype.getRawValueWithoutSuffixEndPosition = function () {
        return this.rawValue.length - this.options.suffix.length;
    };
    InputService.prototype.getRawValueWithoutPrefixStartPosition = function () {
        return this.value != null && this.value < 0 ? this.options.prefix.length + 1 : this.options.prefix.length;
    };
    InputService.prototype.removeNumber = function (keyCode) {
        var _a = this.options, decimal = _a.decimal, thousands = _a.thousands;
        var selectionEnd = this.inputSelection.selectionEnd;
        var selectionStart = this.inputSelection.selectionStart;
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
    };
    InputService.prototype.updateFieldValue = function (selectionStart) {
        var newRawValue = this.applyMask(false, this.rawValue || '');
        selectionStart = selectionStart === undefined ? this.rawValue.length : selectionStart;
        this.inputManager.updateValueAndCursor(newRawValue, this.rawValue.length, selectionStart);
    };
    InputService.prototype.updateOptions = function (options) {
        var value = this.value;
        this.options = options;
        this.value = value;
    };
    Object.defineProperty(InputService.prototype, "canInputMoreNumbers", {
        get: function () {
            return this.inputManager.canInputMoreNumbers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputService.prototype, "inputSelection", {
        get: function () {
            return this.inputManager.inputSelection;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputService.prototype, "rawValue", {
        get: function () {
            return this.inputManager.rawValue;
        },
        set: function (value) {
            this.inputManager.rawValue = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputService.prototype, "storedRawValue", {
        get: function () {
            return this.inputManager.storedRawValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InputService.prototype, "value", {
        get: function () {
            return this.clearMask(this.rawValue);
        },
        set: function (value) {
            this.rawValue = this.applyMask(!!value && !isNaN(value), !!value ? '' + value : '');
        },
        enumerable: true,
        configurable: true
    });
    return InputService;
}());
exports.InputService = InputService;
//# sourceMappingURL=input.service.js.map