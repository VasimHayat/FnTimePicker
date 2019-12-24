import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FnTimePickerComponent } from './time-picker/fn-time-picker.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FnMultiTimePickerComponent } from './multi-time-picker/fn-multi-time-picker.component';

@NgModule({
  declarations: [
    AppComponent,
    FnMultiTimePickerComponent,
    FnTimePickerComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
