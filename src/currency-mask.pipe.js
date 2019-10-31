"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var currency_mask_config_1 = require("./currency-mask.config");
var input_service_1 = require("./input.service");
var CurrencyMaskPipe = /** @class */ (function () {
    function CurrencyMaskPipe(currencyMaskConfig) {
        this.currencyMaskConfig = currencyMaskConfig;
        this.optionsTemplate = {
            align: 'right',
            allowNegative: true,
            decimal: '.',
            precision: 2,
            prefix: '$ ',
            suffix: '',
            thousands: ','
        };
    }
    CurrencyMaskPipe.prototype.transform = function (value, currencyMaskConfig) {
        if (!value) {
            return '';
        }
        if (!!currencyMaskConfig) {
            this.optionsTemplate = currencyMaskConfig;
        }
        this.inputService = new input_service_1.InputService(null, this.optionsTemplate);
        return this.inputService.applyMask(!!value && !isNaN(value), !!value ? '' + value : '');
    };
    CurrencyMaskPipe = __decorate([
        core_1.Pipe({
            name: 'currencyMask'
        }),
        __param(0, core_1.Optional()), __param(0, core_1.Inject(currency_mask_config_1.CURRENCY_MASK_CONFIG)),
        __metadata("design:paramtypes", [Object])
    ], CurrencyMaskPipe);
    return CurrencyMaskPipe;
}());
exports.CurrencyMaskPipe = CurrencyMaskPipe;
//# sourceMappingURL=currency-mask.pipe.js.map