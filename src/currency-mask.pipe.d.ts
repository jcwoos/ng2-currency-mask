import { PipeTransform } from '@angular/core';
import { CurrencyMaskConfig } from './currency-mask.config';
export declare class CurrencyMaskPipe implements PipeTransform {
    private currencyMaskConfig;
    private inputService;
    optionsTemplate: {
        align: string;
        allowNegative: boolean;
        decimal: string;
        precision: number;
        prefix: string;
        suffix: string;
        thousands: string;
    };
    constructor(currencyMaskConfig: CurrencyMaskConfig);
    transform(value: any, currencyMaskConfig: CurrencyMaskConfig): any;
}
