import { VibrationWrapper } from './../../../core/cordova-wrappers/vibration.wrapper';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs/Rx';

/**
 * A component used for capturing a passcode from the user. The compoment only captures the passcode, it does
 * not perform an processing. This allows the compoment to be used in multiple different scenarios. 
 */
@Component({
  selector: 'passcode-entry',
  templateUrl: 'passcode-entry.html'
})
export class PasscodeEntryComponent {

  private setDigits: boolean[];
  private incorrect: boolean;
  private correct: boolean;
  private busy: boolean;

  /**
   * The number of digits that passcode is made up of.
   */
  private _numberOfDigits: number;
  public get numberOfDigits(): number {
    return this._numberOfDigits;
  }
  @Input()
  public set numberOfDigits(value: number) {
    this._numberOfDigits = value;
    this.resetSetDigits();
  }

  /**
   * Indicates that the passcode has been completed and is ready to be dealt with by an external component.
   */
  @Output() onPasscodeCompleted = new EventEmitter<PasscodeCompletedEvent>();

  /**
   * Creates an instance of PasscodeEntryComponent.
   */
  constructor(private vibrationWrapper: VibrationWrapper) {
  }

  private passcode: string = '';

  // #region Public Methods

  /**
   * Clears the passcode.
   */
  public clear() {
    this.incorrect = false;
    this.passcode = '';
    this.resetSetDigits();
  }

  /**
   * Notifies the component that the passcode is correct. Typically this method is called
   * in response to the onPasscodeCompleted event being emitted.
   */
  public notifyCorrect() {
    this.clear();
    this.correct = true;
    this.busy = false;
  }

  /**
   * Notifies the component that the passcode is incorrect. Typically this method is called
   * in response to the onPasscodeCompleted event being emitted.
   */
  public notifyIncorrect(): Observable<{}> {

    this.incorrect = true;

    // Vibrate the device
    this.vibrationWrapper.vibrate(500);

    // Create an observable that is delayed until the CSS animations have finished
    var observable = Observable.empty()
      .delay(1000);

    // Clear the passcode after the delay
    observable.subscribe(
      next => { },
      error => { },
      () => {
        this.clear();
        this.busy = false;
      });

    // Return
    return observable;
  }

  // #endregion

  // #region Private Methods

  /**
   * Resets the digits that have been set.
   */
  private resetSetDigits() {
    this.setDigits = [];
    for (var i = 0; i < this._numberOfDigits; i++) {
      this.setDigits.push(false);
    }
  }

  // #endregion

  // #region Event Handlers

  /**
   * Handles the event when a number is clicked on the numeric keypad.
   */
  protected onNumberClicked(num: number) {

    // Exit if the component is busy
    if (this.busy) {
      return;
    }

    // Exit if the password already has the full number of digits
    if (this.passcode.length >= this.numberOfDigits) {
      return;
    }

    // Add the next digit
    this.passcode += num;

    // Update the set digits
    this.setDigits[this.passcode.length - 1] = true;

    // Emit the event if the passcode has been completed
    if (this.passcode.length == this.numberOfDigits) {
      this.busy = true;
      this.onPasscodeCompleted.emit(new PasscodeCompletedEvent(this.passcode, this));
    }
  }

  /**
   * Handles the event when the delete button is clicked on the numeric keypad.
   */
  protected onDeleteClicked() {

    // Exit if the component is busy
    if (this.busy) {
      return;
    }

    // Exit if there are no digits
    if (this.passcode.length === 0) {
      return
    }

    // Remove the last digit if the passcode has any
    this.passcode = this.passcode.substr(0, this.passcode.length - 1);

    // Update the set digits
    this.setDigits[this.passcode.length] = false;
  }

  // #endregion
}

/**
 * Defines the event that is emitted when the passcode is completed.
 */
export class PasscodeCompletedEvent {
  constructor(
    public passcode: string,
    public source: PasscodeEntryComponent) { }
}