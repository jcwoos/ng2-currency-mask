export declare class InputService {
    private htmlInputElement;
    private options;
    private inputManager;
    constructor(htmlInputElement: any, options: any);
    addNumber(keyCode: number): void;
    insertKeyChar(keyChar: string, selectionStart: number, selectionEnd: number): string;
    applyMask(isNumber: boolean, rawValue: string): string;
    clearMask(rawValue: string): number;
    changeToNegative(): void;
    changeToPositive(): void;
    fixCursorPosition(forceToEndPosition?: boolean): void;
    getRawValueWithoutSuffixEndPosition(): number;
    getRawValueWithoutPrefixStartPosition(): number;
    removeNumber(keyCode: number): void;
    updateFieldValue(selectionStart?: number): void;
    updateOptions(options: any): void;
    readonly canInputMoreNumbers: boolean;
    readonly inputSelection: any;
    rawValue: string;
    readonly storedRawValue: string;
    value: number;
}
