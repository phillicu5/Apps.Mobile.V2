import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NativeAudioWrapper } from '../../../core/cordova-wrappers';

/**
 * A component that displays a numeric keypad to the user.
 * 
 * @export
 * @class NumericKeypadComponent
 */
@Component({
    selector: 'numeric-keypad',
    templateUrl: 'numeric-keypad.html'
})
export class NumericKeypadComponent {

    /**
     * Specifies whether the keypad is busy and cannot be interacted with.
     */
    @Input()
    public busy: boolean;

    /**
     * Specifies whether the backspace button should be shown.
     */
    @Input()
    public showBackspace: boolean;

    /**
     * Emitted when any of the number buttons are clicked. 
     */
    @Output()
    public numberClicked = new EventEmitter<number>();

    /**
     * Emitted when the delete button is clicked. 
     */
    @Output()
    public deleteClicked = new EventEmitter();

    /**
     * Creates an instance of NumericKeypadComponent.
     */
    constructor(private nativeAudioWrapper: NativeAudioWrapper) {
    }

    /**
     * Handles the event when any of the number buttons are clicked.
     */
    public onNumberClicked(value: number) {

        // Exit if the component is busy
        if (this.busy) {
            return;
        }

        // Play the tap noise
        this.nativeAudioWrapper.playTap();

        // Emit the event
        this.numberClicked.emit(value);
    }

    /**
     * Handles the event when the delete button is clicked.
     */
    public onDeleteClicked() {

        // Exit if the component is busy
        if (this.busy) {
            return;
        }

        // Play the tap noise
        this.nativeAudioWrapper.playTap();

        // Emit the event
        this.deleteClicked.emit();
    }
}
