import { Component, OnInit, Input } from '@angular/core';
import { Hour12Format, Hour24Format, Hour12NextFormat, Hour24NextFormat } from './../custom-time-modal';

@Component({
  selector: 'app-custom-time-picker',
  templateUrl: './custom-time-picker.component.html',
  styleUrls: ['./custom-time-picker.component.css']
})
export class CustomTimePickerComponent implements OnInit {

  @Input() startIndexVal;
  @Input() lastIndexVal;
  @Input() placeHolder;
  @Input() timeFormat24;

  matchingItems = [];
  yourNewArray = [];
  searchValue = "";
  searchShowValue = "";

  firstDigitArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  secondDigitArray = ['00a', '00p', '15a', '15p', '30a', '30p', '45a', '45p'];
  first24DigitArray = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  second24DigitArray = ['00', '15', '30', '45'];


  afterSplit;
  selectValIndex;
  arrowkeyLocation = 0;
  showDropDown: boolean = true;
  checkEmpty: boolean = false;
  inputVal;
  HmFormat = Hour24Format;
  HmaFormat = Hour12Format;
  HmaD1Format = Hour12NextFormat;
  HmD1Format = Hour24NextFormat;
  regex12a;
  regex12p;
  public activeIndex: number = -1;

  constructor() { }

  ngOnInit() {

    if (this.timeFormat24 == 24) {
      this.matchingItems = this.HmFormat;
    } else {
      this.matchingItems = this.HmaFormat;
    }
    this.searchShowValue = this.matchingItems[this.startIndexVal] + '-' + this.matchingItems[this.lastIndexVal];
    if (this.searchShowValue == "") {
      this.inputVal = "";
    }
    this.selectValIndex = this.startIndexVal;
    this.searchValue = this.searchShowValue;
  }

  ngAfterViewInit() {
    // console.log(this.searchValue, "initial");
  }

  // this filter function call on keypress on input box for filter data in array
  filterValue(event) {

    this.showDropDown = true;
    var filterVal = event.target.value;
    if (filterVal != "" || filterVal != null || filterVal != undefined) {
      this.checkEmpty = false;
      this.inputVal = filterVal;
      this.afterSplit = this.inputVal.split('-');
      this.regex12a = new RegExp("^([1-9]|1[012])(a)$");
      this.regex12p = new RegExp("^([1-9]|1[012])(p)$");

      if (this.afterSplit[1]) {
        this.inputVal = this.afterSplit[1];
        if (this.selectValIndex) {

          var firstValTime = this.afterSplit[0].split(':');
          if (this.timeFormat24 == 24) {
            if (this.first24DigitArray.includes(firstValTime[0]) && this.second24DigitArray.includes(firstValTime[1])) {
              this.yourNewArray = this.HmD1Format.filter(items => items.includes(this.inputVal) && this.HmD1Format.indexOf(items) > this.selectValIndex);
            } else {
              this.activeIndex = 0;
              this.yourNewArray = [];
            }
          } else {
            // this code written for matching regex for To time
            if (this.regex12a.test(this.inputVal)) {
              var timeStringSplit = this.inputVal.split('a');
              if (this.firstDigitArray.includes(firstValTime[0]) && this.secondDigitArray.includes(firstValTime[1])) {
                this.yourNewArray = this.HmaD1Format.filter(items => (items.includes(timeStringSplit[0]) && items.includes('a')) && this.HmaD1Format.indexOf(items) > this.selectValIndex);
              } else {
                this.activeIndex = 0;
                this.yourNewArray = [];
              }

            } else if (this.regex12p.test(this.inputVal)) {
              var timeStringSplit = this.inputVal.split('p');
              if (this.firstDigitArray.includes(firstValTime[0]) && this.secondDigitArray.includes(firstValTime[1])) {
                this.yourNewArray = this.HmaD1Format.filter(items => (items.includes(timeStringSplit[0]) && items.includes('p')) && this.HmaD1Format.indexOf(items) > this.selectValIndex);
              } else {
                this.activeIndex = 0;
                this.yourNewArray = [];
              }
            } else {

              if (this.firstDigitArray.includes(firstValTime[0]) && this.secondDigitArray.includes(firstValTime[1])) {
                this.yourNewArray = this.HmaD1Format.filter(items => items.includes(this.inputVal) && this.HmaD1Format.indexOf(items) > this.selectValIndex);
              } else {
                this.activeIndex = 0;
                this.yourNewArray = [];
              }

            }


          }
        }
      } else {
        // this code is written for matching From time
        if (this.regex12a.test(this.inputVal)) {

          var timeStringSplit = this.inputVal.split('a');
          this.yourNewArray = this.matchingItems.filter(items => items.includes(timeStringSplit[0]) && items.includes('a'));

        } else if (this.regex12p.test(this.inputVal)) {

          var timeStringSplit = this.inputVal.split('p');
          this.yourNewArray = this.matchingItems.filter(items => items.includes(timeStringSplit[0]) && items.includes('p'));
        } else {
          this.yourNewArray = this.matchingItems.filter(items => items.includes(this.inputVal));
        }
      }

      if (event.keyCode == 8) {
        this.activeIndex = 0;
        if (this.yourNewArray.length > 0) {

          setTimeout(() => document.getElementById('containerDiv').scrollTop = 0)
        }
      }

      if (event.keyCode == 13 && this.yourNewArray.length > 0) {
        var liVal = document.querySelector("li.active").textContent;
        this.selectedValueFunction(liVal);
        this.activeIndex = 0;
        this.yourNewArray = [];
        document.getElementById('containerDiv').scrollTop = 0;
        this.checkEmpty == false;
      }



    } else {

      this.activeIndex = 0;
      this.checkEmpty = true;
      this.yourNewArray = [];
    }

  }

  // selectedValueFunction is call after click on li option in ul after apply filter
  selectedValueFunction(param) {

    var paramNext = param;
    if (this.afterSplit[1]) {
      this.activeIndex = 0;
      var newToTimeString = this.searchShowValue.split('-')[0];
      this.searchShowValue = newToTimeString + '-' + paramNext;
      this.searchValue = this.searchShowValue;
      this.yourNewArray = [];

    } else {
      this.activeIndex = 0;
      this.searchShowValue = param + '-';
      this.selectValIndex = this.matchingItems.indexOf(param);
      this.yourNewArray = [];
    }

  }

  closeDropDown() {
    this.showDropDown = false;
  }

  openDropDown() {
    this.showDropDown = true;
    if (this.checkEmpty == true) {
      this.filterValue('0');
    }
  }



  doSomething(event): void {

    if (event.code == "ArrowUp" && this.activeIndex > 0) {
      this.activeIndex--;
      document.getElementById('containerDiv').scrollTop -= 35;
    }

    if (event.code == "ArrowDown" && this.activeIndex < this.yourNewArray.length - 1) {
      this.activeIndex++
      document.getElementById('containerDiv').scrollTop += 35;
    }
  }


}
