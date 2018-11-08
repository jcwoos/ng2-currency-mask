import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CurrencyMaskDirective } from './currency-mask.directive';
import { CurrencyMaskPipe } from './currency-mask.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        CurrencyMaskDirective,
        CurrencyMaskPipe,
    ],
    exports: [
        CurrencyMaskDirective,
        CurrencyMaskPipe,
    ]
})
export class CurrencyMaskModule {
}
