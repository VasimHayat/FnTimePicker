import { Component, OnInit, Input } from '@angular/core';
import { FnTimepickerService } from '../services/timepicker.service';

@Component({
  selector: 'fn-multi-time-picker',
  templateUrl: './fn-multi-time-picker.component.html',
  styleUrls: ['./fn-multi-time-picker.component.css']
})
export class FnMultiTimePickerComponent implements OnInit {

  @Input() startIndex: number;
  @Input() lastIndex: number;
  @Input() placeHolder: string;
  @Input() isMilitryTime: boolean;

  timeStoredArray = [];
  uiItemArray = [];
  nonMilitryHourArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  nonMilitryMinuteArray = ['00a', '00p', '15a', '15p', '30a', '30p', '45a', '45p'];
  militryHourArray = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  militryMinuteArray = ['00', '15', '30', '45'];
  showDropDown: boolean = true;
  checkEmpty: boolean = false;
  activeIndex: number = -1;
  searchInputVal: string = "";
  showInputVal: string = "";
  splitTimeVal: string;
  selectIndex: number;
  inputVal: any;

  constructor(private service: FnTimepickerService) { }

  ngOnInit() {

    if (this.isMilitryTime) {
      this.timeStoredArray = this.service.Hour24Format;
    } else {
      this.timeStoredArray = this.service.Hour12Format;
    }

    this.showInputVal = this.timeStoredArray[this.startIndex] + '-' + this.timeStoredArray[this.lastIndex];
    if (this.showInputVal == "") {
      this.inputVal = "";
    }
    this.selectIndex = this.startIndex;
    this.searchInputVal = this.showInputVal;

  }

  ngAfterViewInit() {
    // console.log(this.searchInputVal, "initial");
  }

  // this filter function call on keypress on input box for filter data in array
  filterValue(event) {

    this.showDropDown = true;
    var filterVal = event.target.value;
    if (filterVal != "" || filterVal != null || filterVal != undefined) {
      this.checkEmpty = false;
      this.inputVal = filterVal;
      this.splitTimeVal = this.inputVal.split('-');
      if (this.splitTimeVal[1]) {
        this.inputVal = this.splitTimeVal[1];
        if (this.selectIndex) {
          var splitFromTime = this.splitTimeVal[0].split(':');
          if (this.isMilitryTime) {
            if (this.militryHourArray.includes(splitFromTime[0]) && this.militryMinuteArray.includes(splitFromTime[1])) {
              this.uiItemArray = this.service.Hour24NextFormat.filter(items => items.includes(this.inputVal) && this.service.Hour24NextFormat.indexOf(items) > this.selectIndex);
            } else {
              this.activeIndex = 0;
              this.uiItemArray = [];
            }
          } else {
            // this code written for matching regex for To time
            if (this.service.regex12a.test(this.inputVal)) {
              var timeStringSplit = this.inputVal.split('a');
              if (this.nonMilitryHourArray.includes(splitFromTime[0]) && this.nonMilitryMinuteArray.includes(splitFromTime[1])) {
                this.uiItemArray = this.service.Hour12NextFormat.filter(items => (items.includes(timeStringSplit[0]) && items.includes('a')) && this.service.Hour12NextFormat.indexOf(items) > this.selectIndex);
              } else {
                this.activeIndex = 0;
                this.uiItemArray = [];
              }

            } else if (this.service.regex12p.test(this.inputVal)) {
              var timeStringSplit = this.inputVal.split('p');
              if (this.nonMilitryHourArray.includes(splitFromTime[0]) && this.nonMilitryMinuteArray.includes(splitFromTime[1])) {
                this.uiItemArray = this.service.Hour12NextFormat.filter(items => (items.includes(timeStringSplit[0]) && items.includes('p')) && this.service.Hour12NextFormat.indexOf(items) > this.selectIndex);
              } else {
                this.activeIndex = 0;
                this.uiItemArray = [];
              }
            } else {

              if (this.nonMilitryHourArray.includes(splitFromTime[0]) && this.nonMilitryMinuteArray.includes(splitFromTime[1])) {
                this.uiItemArray = this.service.Hour12NextFormat.filter(items => items.includes(this.inputVal) && this.service.Hour12NextFormat.indexOf(items) > this.selectIndex);
              } else {
                this.activeIndex = 0;
                this.uiItemArray = [];
              }

            }


          }
        }
      } else {
        // this code is written for matching From time
        if (this.service.regex12a.test(this.inputVal)) {

          var timeStringSplit = this.inputVal.split('a');
          this.uiItemArray = this.timeStoredArray.filter(items => items.includes(timeStringSplit[0]) && items.includes('a'));

        } else if (this.service.regex12p.test(this.inputVal)) {

          var timeStringSplit = this.inputVal.split('p');
          this.uiItemArray = this.timeStoredArray.filter(items => items.includes(timeStringSplit[0]) && items.includes('p'));
        } else {
          if (this.isMilitryTime) {
            let term = this.inputVal.toString().split(":");
            let modifiedTerm = parseInt(term[0]) < 10 && !term[0].toString().startsWith("0") ? '0' + term[0] + (term.length > 1 ? ":" + term[1] : '') : this.inputVal;
            this.uiItemArray = this.timeStoredArray.filter(items => items.toString().startsWith(modifiedTerm));
          } else {
            this.uiItemArray = this.timeStoredArray.filter(items => items.toString().startsWith(this.inputVal));
          }

          // this.uiItemArray = this.timeStoredArray.filter(items => items.includes(this.inputVal));
        }
      }

      if (event.keyCode == this.service.KEY_CODES.BACKSPACE) {
        this.activeIndex = 0;
        if (this.uiItemArray.length > 0) {

          setTimeout(() => document.getElementById('fn-time-picker-ul').scrollTop = 0)
        }
      }

      if (event.keyCode == this.service.KEY_CODES.ENTER && this.uiItemArray.length > 0) {
        var liVal = document.querySelector("li.active").textContent;
        this.selectedValueFunction(liVal);
        this.activeIndex = 0;
        this.uiItemArray = [];
        document.getElementById('fn-time-picker-ul').scrollTop = 0;
        this.checkEmpty == false;
      }

    } else {
      this.activeIndex = 0;
      this.checkEmpty = true;
      this.uiItemArray = [];
    }

  }

  // selectedValueFunction is call after click on li option in ul after apply filter
  selectedValueFunction(param) {

    var paramNext = param;
    if (this.splitTimeVal[1]) {
      this.activeIndex = 0;
      var newToTimeString = this.showInputVal.split('-')[0];
      this.showInputVal = newToTimeString + '-' + paramNext;
      this.searchInputVal = this.showInputVal;
      this.uiItemArray = [];

    } else {
      this.activeIndex = 0;
      this.showInputVal = param + '-';
      this.selectIndex = this.timeStoredArray.indexOf(param);
      this.uiItemArray = [];
    }

  }

  closeDropDown() {
    this.showDropDown = false;
  }

  openDropDown() {
    this.showDropDown = true;
    if (this.checkEmpty) {
      this.filterValue('0');
    }
  }

  keyDownChange(event): void {

    if (event.code == "ArrowUp" && this.activeIndex > 0) {
      this.activeIndex--;
      document.getElementById('fn-time-picker-ul').scrollTop -= 35;
    }
    if (event.code == "ArrowDown" && this.activeIndex < this.uiItemArray.length - 1) {
      this.activeIndex++
      document.getElementById('fn-time-picker-ul').scrollTop += 35;
    }

  }

}
