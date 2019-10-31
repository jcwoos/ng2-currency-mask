import { Inject, Optional, Pipe, PipeTransform } from '@angular/core';

import { CURRENCY_MASK_CONFIG, CurrencyMaskConfig } from './currency-mask.config';
import { InputService } from './input.service';

@Pipe({
    name: 'currencyMask'
})
export class CurrencyMaskPipe implements PipeTransform {
    private inputService: InputService;
    optionsTemplate = {
        align: 'right',
        allowNegative: true,
        decimal: '.',
        precision: 2,
        prefix: '$ ',
        suffix: '',
        thousands: ','
    };

    constructor(@Optional() @Inject(CURRENCY_MASK_CONFIG) private currencyMaskConfig: CurrencyMaskConfig) { }

    transform(value: any, currencyMaskConfig: CurrencyMaskConfig): any {
        if (!value) {
            return '';
        }

        if (!!currencyMaskConfig) {
            this.optionsTemplate = currencyMaskConfig;
        }

        this.inputService = new InputService(null, this.optionsTemplate);

        return this.inputService.applyMask(!!value && !isNaN(value), !!value ? '' + value : '');
    }
}
