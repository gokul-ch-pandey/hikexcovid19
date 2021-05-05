import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { cityData, exclusiveSearch, inclusiveSearch, medicine, neededOrAvailable, searchMore, verifiedTweets } from '../assets/data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  options = cityData;


  filteredOptions: Observable<string[]>;

  ngOnInit() {
    this.filteredOptions = this.form.controls.city.valueChanges.pipe(startWith(''), map(value => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  form: FormGroup;

  finalLink;
  title = "Covid 19 Twitter Help App";

  ordersData = searchMore;


  medicine = medicine;

  inclusiveSearch = inclusiveSearch;

  neededOrAvailable = neededOrAvailable;

  exclusiveSearch = exclusiveSearch;

  verifiedTweets = verifiedTweets;

  city = "";
  otherSearch = "";


  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      orders: new FormArray([]),
      inclusiveSearch: new FormArray([]),
      exclusiveSearch: new FormArray([]),
      verifiedTweets: new FormArray([]),
      // city: ['', [Validators.required]],
      city: new FormControl(),
      medicine: new FormArray([]),
      otherSearch: new FormControl()
    });

    this.addCheckboxes();
    this.addinclusiveSearch();
    this.addExclusiveSearch();
    this.addVerifiedTweets();
    this.addMedicine();
  }

  private addMedicine() {
    this.medicine.forEach((o, i) => {
      const control = new FormControl(i === 0); // if first item set to true, else false
      (this.form.controls.medicine as FormArray).push(control);
    });
  }


  private addCheckboxes() {
    this.ordersData.forEach((o, i) => {
      const control = new FormControl(i === 0); // if first item set to true, else false
      (this.form.controls.orders as FormArray).push(control);
    });
  }


  private addinclusiveSearch() {
    this.inclusiveSearch.forEach((o, i) => {
      const control = new FormControl(i === 0); // if first item set to true, else false
      (this.form.controls.inclusiveSearch as FormArray).push(control);
    });
  }


  private addExclusiveSearch() {
    this.exclusiveSearch.forEach((o, i) => {
      const control = new FormControl(i === 0); // if first item set to true, else false
      (this.form.controls.exclusiveSearch as FormArray).push(control);
    });
  }

  private addVerifiedTweets() {
    this.verifiedTweets.forEach((o, i) => {
      const control = new FormControl(i === 0); // if first item set to true, else false
      (this.form.controls.verifiedTweets as FormArray).push(control);
    });
  }

  submit() {
    var cty = this.form.controls.city.value;
    if (cty === "" || cty === undefined || cty == null) {
      alert("Please select City to generate leads!!!");
    } else {
      this.finalLink = "https://twitter.com/search?q=";

      this.form.value.verifiedTweets
        .map((v, i) => v ? this.verifiedTweets[i].id : null)
        .filter(v => v !== null).forEach(element => {
          this.finalLink += element;
        });

      //append city 
      console.log(this.form.controls.city.value);
      this.finalLink += " " + this.form.controls.city.value + " "

      const selectedOrderIds = this.form.value.orders
        .map((v, i) => v ? this.ordersData[i].name : null)
        .filter(v => v !== null);

      const selectedMedicine = this.form.value.medicine
        .map((v, i) => v ? this.medicine[i].name : null)
        .filter(v => v !== null);

      let othersrch = this.form.controls.otherSearch.value;
      this.finalLink += "(";
      let count = 0;
      selectedOrderIds.forEach(element => {
        if (count != 0)
          this.finalLink += "+OR+"
        this.finalLink += element;
        count++;
      });
      if (othersrch != "" && othersrch != null && othersrch != undefined) {
        if (count != 0)
          this.finalLink += "+OR+"
        this.finalLink += othersrch;
      }
      selectedMedicine.forEach(element => {
        this.finalLink += "+OR+"
        this.finalLink += element;
      });
      this.finalLink += ")";


      this.form.value.inclusiveSearch
        .map((v, i) => v ? this.inclusiveSearch[i].name : null)
        .filter(v => v !== null).forEach(element => {
          this.finalLink += "+";
          this.finalLink += '"' + element + '"';
        });


      this.form.value.exclusiveSearch
        .map((v, i) => v ? this.exclusiveSearch[i].name : null)
        .filter(v => v !== null).forEach(element => {
          this.finalLink += "-";
          this.finalLink += '"' + element + '"';
        });

      this.finalLink += "&f=live";



      console.log(encodeURI(this.finalLink));
    }

  }
}
