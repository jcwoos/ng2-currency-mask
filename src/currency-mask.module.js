"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var currency_mask_directive_1 = require("./currency-mask.directive");
var currency_mask_pipe_1 = require("./currency-mask.pipe");
var CurrencyMaskModule = /** @class */ (function () {
    function CurrencyMaskModule() {
    }
    CurrencyMaskModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule
            ],
            declarations: [
                currency_mask_directive_1.CurrencyMaskDirective,
                currency_mask_pipe_1.CurrencyMaskPipe,
            ],
            exports: [
                currency_mask_directive_1.CurrencyMaskDirective,
                currency_mask_pipe_1.CurrencyMaskPipe,
            ]
        })
    ], CurrencyMaskModule);
    return CurrencyMaskModule;
}());
exports.CurrencyMaskModule = CurrencyMaskModule;
//# sourceMappingURL=currency-mask.module.js.map