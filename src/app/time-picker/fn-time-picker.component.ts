import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FnTimepickerService } from './../services/timepicker.service';

@Component({
  selector: 'fn-time-picker',
  templateUrl: './fn-time-picker.component.html',
  styleUrls: ['./fn-time-picker.component.css']
})
export class FnTimePickerComponent implements OnInit {


  @Input() index: number;
  @Input() placeHolder: string;
  @Input() isMilitryTime: boolean;

  mainItemArray = [];
  uiItemArray = [];
  searchTerm = "1";

  showDropDown: boolean = true;
  public activeItem = -1;

  constructor(private timePickerSvcs: FnTimepickerService) { }

  ngOnInit() {

    if (this.isMilitryTime) {
      this.mainItemArray = this.timePickerSvcs.Hour24Format;
    } else {
      this.mainItemArray = this.timePickerSvcs.Hour12Format;
    }

    this.searchTerm = this.mainItemArray[this.index];

  }

  // this filter function call on keypress on input box for filter data in array
  filterValue(event: KeyboardEvent) {

    this.showDropDown = true;
    if (typeof (this.searchTerm) !== "undefined") {

      // this code is written for matching From time
      if (this.timePickerSvcs.regex12a.test(this.searchTerm)) {

        let timeStringSplit = this.searchTerm.split('a');
        this.uiItemArray = this.mainItemArray.filter(items => items.includes(timeStringSplit[0]) && items.includes('a'));

      } else if (this.timePickerSvcs.regex12p.test(this.searchTerm)) {
        let timeStringSplit = this.searchTerm.split('p');
        this.uiItemArray = this.mainItemArray.filter(items => items.includes(timeStringSplit[0]) && items.includes('p'));
      } else {
        if (this.isMilitryTime) {
          let term = this.searchTerm.toString().split(":");
          let modifiedTerm = parseInt(term[0]) < 10 && !term[0].toString().startsWith("0") ? '0' + term[0] + (term.length > 1 ? ":" + term[1] : '') : this.searchTerm;
          this.uiItemArray = this.mainItemArray.filter(items => items.toString().startsWith(modifiedTerm));
        } else {
          this.uiItemArray = this.mainItemArray.filter(items => items.toString().startsWith(this.searchTerm));
        }


      }

      // this function call on backspce
      if (event.keyCode == this.timePickerSvcs.KEY_CODES.BACKSPACE) {
        this.activeItem = 0;
        if (this.uiItemArray.length > 0) {
          setTimeout(() => document.getElementById('containerDivSingle').scrollTop = 0)
        }
      }

      // this function call on enter after select value in dropdown list
      if (event.keyCode == this.timePickerSvcs.KEY_CODES.ENTER && this.uiItemArray.length > 0) {
        const liVal = document.querySelector("li.active").textContent;
        this.onItemClick(liVal);
        this.activeItem = 0;
        this.uiItemArray = [];
        document.getElementById('.fn-time-picker-ul').scrollTop = 0;
      }

    } else {
      this.activeItem = 0;
      this.uiItemArray = [];
    }

  }

  // onSelectEvent is call after click on li option in ul after apply filter
  onItemClick(indexVal: string) {

    this.activeItem = 0;
    this.searchTerm = indexVal;
    this.index = this.mainItemArray.indexOf(indexVal);
    this.uiItemArray = [];
    console.log(this.index)

  }

  closeDropDown() {
    this.showDropDown = false;
  }

  // Open Dropdown by default value
  clickEvent(event: KeyboardEvent) {
    this.showDropDown = true;
    if (this.activeItem < 1) {
      this.filterValue(event);
    }
  }

  keydownEvent(event: KeyboardEvent) {
    if (event.code == "ArrowUp" && this.activeItem > 0) {
      this.activeItem--;
      document.getElementById('.fn-time-picker-ul').scrollTop -= 35;
    }

    if (event.code == "ArrowDown" && this.activeItem < this.uiItemArray.length - 1) {
      this.activeItem++
      document.getElementById('.fn-time-picker-ul').scrollTop += 35;
    }
  }

}
