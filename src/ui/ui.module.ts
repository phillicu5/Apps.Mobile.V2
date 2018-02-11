import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { NumericKeypadComponent } from './components/numeric-keypad/numeric-keypad';
import { PasscodeEntryComponent } from './components/passcode-entry/passcode-entry';

@NgModule({
	declarations: [
		NumericKeypadComponent,
		PasscodeEntryComponent],
	imports: [
		IonicModule
	],
	exports: [
		NumericKeypadComponent,
		PasscodeEntryComponent]
})
export class UIModule { }
