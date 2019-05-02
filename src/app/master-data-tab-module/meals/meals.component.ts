import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { MasterDataService } from '../master-data.service';
import { FormControl } from '@angular/forms';
import { Meal } from '../meal';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.css']
})
export class MealsComponent implements OnInit {
  constructor(
    private matSnackBar: MatSnackBar,
    public masterDataSvc: MasterDataService,
    public dialog: MatDialog
  ) {
    this.mealCourseType.setValue([this.mealCourse[0]]);
  }
  // To make Divs editable
  editMode = false;

  // Menu Buttons activity
  toolBtnAddNew = true;
  toolBtnExisting = false;

  // Form Controls intialization
  mealCourseType = new FormControl();
  mealCourse = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Soup', 'Juice'];
  dietPref = ['Vegan', 'Vegetarian', 'Non-Vegetarian'];
  diet = {
    _id: '',
    foodPreference: this.dietPref[0],
    ingredients: '',
    nutritionInfo: '',
    directions: '',
    dietType: '',
    avoidableMedCond: '',
    cuisine: '',
    photoURL: '',
    calories: 0,
    name: '',
    course: '',
    idealMedCond: []
  };

  files: any;
  mealsArray: Meal[];
  // HTML Editor drop-down initialize
  selected = 'nutritionInfo';
  ngOnInit() {}

  onResetPress(mealForm) {
    mealForm.reset();
    this.mealCourseType.setValue([this.mealCourse[0]]);
    this.diet.foodPreference = this.dietPref[0];
    const nutInfo = document.getElementById('nutritionInfoTxt');
    const ingrdInfo = document.getElementById('ingredientsTxt');
    const drctnInfo = document.getElementById('directionsTxt');
    nutInfo.innerHTML = 'Provide Nutrition Info text from HTML Editor';
    nutInfo.contentEditable = 'false';
    ingrdInfo.innerHTML = 'Provide Ingredients Info text from HTML Editor';
    ingrdInfo.contentEditable = 'false';
    drctnInfo.innerHTML = 'Provide Directions Info from HTML Editor';
    drctnInfo.contentEditable = 'false';
  }
  /* Form Submission */

  onFormSubmit(mealForm) {
    // Accessing diet model
    const diet = this.diet;
    const dietTypeArr = diet.dietType.split(',');
    const courseArr = this.mealCourseType.value;
    const avoidableMedCondArr = diet.avoidableMedCond.split(',');

    const meal = new Meal();
    if (diet._id) {
      meal._id = diet._id;
    }
    meal.avoidableMedCond = avoidableMedCondArr;
    meal.calories = diet.calories;
    meal.course = courseArr;
    meal.cuisine = diet.cuisine;
    meal.dietType = dietTypeArr;
    meal.directions = diet.directions;
    meal.foodPreference = diet.foodPreference;
    meal.ingredients = diet.ingredients;
    meal.name = diet.name;
    meal.nutritionInfo = diet.nutritionInfo;
    meal.photoURL = diet.photoURL;
    meal.idealMedCond = [];

    if (this.editMode) {
      meal.nutritionInfo = document.getElementById(
        'nutritionInfoTxt'
      ).innerHTML;
      meal.ingredients = document.getElementById('ingredientsTxt').innerHTML;
      meal.directions = document.getElementById('directionsTxt').innerHTML;
      this.masterDataSvc.updateMeal(meal).subscribe(
        data => {
          this.onResetPress(mealForm);
          this.matSnackBar.open('Meal updated successfully', 'OK');
          this.editMode = false;
        },
        err => {
          console.log(err);
          this.matSnackBar.open('Some Error Occurred :' + err, 'OK');
        }
      );
    } else {
      this.masterDataSvc.addNewMeal(meal).subscribe(
        data => {
          this.onResetPress(mealForm);
          this.matSnackBar.open('Meal added successfully', 'OK');
        },
        err => {
          console.log(err);
          this.matSnackBar.open('Some Error Occurred :' + err, 'OK');
        }
      );
    }
  }

  btnEditExstngPress() {
    const me = this;
    this.editMode = true;
    this.toolBtnAddNew = false;
    this.toolBtnExisting = true;
    const dialogRef = this.dialog.open(MealsListDialog, {
      width: '700px',
      height: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const dietRef = me.diet;
        me.mealCourseType.setValue(result.course);
        const nutInfo = document.getElementById('nutritionInfoTxt');
        const ingrdInfo = document.getElementById('ingredientsTxt');
        const drctnInfo = document.getElementById('directionsTxt');
        nutInfo.innerHTML = result.nutritionInfo;
        nutInfo.contentEditable = 'true';
        ingrdInfo.innerHTML = result.ingredients;
        ingrdInfo.contentEditable = 'true';
        drctnInfo.innerHTML = result.directions;
        drctnInfo.contentEditable = 'true';

        dietRef.foodPreference = result.foodPreference;
        dietRef.dietType = result.dietType.toLocaleString();
        dietRef.avoidableMedCond = result.avoidableMedCond.toLocaleString();
        dietRef.cuisine = result.cuisine;
        const url = result.photoURL.split('/');
        dietRef.photoURL = url[url.length - 1];
        dietRef.calories = result.calories;
        dietRef.name = result.name;
        dietRef._id = result._id;
      }
    });
  }

  btnAddNewPress() {
    this.toolBtnExisting = false;
    this.toolBtnAddNew = true;
  }

  htmlTextSubmit(selected) {
    setTimeout(() => {
      this.diet[selected] = document.getElementsByTagName('input')[
        'htmlInp'
      ].value;
      document.getElementById(selected + 'Txt').innerHTML = this.diet[selected];
    }, 50);
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'meals-list-dialog',
  templateUrl: './meals_list.dialog.html',
  styles: [
    `
      .example-container {
        position: relative;
      }
      .example-loading-shade {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0px;
        right: 0;
        background: rgba(0, 0, 0, 0.15);
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      tr.handleRowHover:hover {
        background-color: #f5f5f5 !important;
      }

      .deleteBtn,
      .editBtn {
        color: blue !important;
        text-decoration: underline !important;
        cursor: pointer !important;
      }
      .deleteBtn:hover {
        color: red !important;
        text-decoration: underline;
      }
    `
  ]
})
// tslint:disable-next-line:component-class-suffix
export class MealsListDialog {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  data = new MatTableDataSource<Meal>();
  resultsLength = 0;
  isLoadingResults = false;
  constructor(
    public dialogRef: MatDialogRef<MealsListDialog>,
    public masterDataSvc: MasterDataService,
    public cnfDialog: MatDialog,
    private matSnackBar: MatSnackBar
  ) {}

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.getMealsData(0, 10);
    this.data.paginator = this.paginator;
  }

  getMealsData(skip: number, top: number) {
    const data = this.masterDataSvc.getMealsList(skip, top).subscribe(
      result => {
        this.data.data = result;
      },
      err => {
        console.error('Some error occurred : ' + err);
      }
    );
  }

  handleAction(element, action) {
    if (action === 'edit') {
      this.dialogRef.close(element);
    } else {
      const cnfDialogRef = this.cnfDialog.open(ConfirmationDialog, {
        width: 'auto',
        height: 'auto'
      });

      cnfDialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.masterDataSvc.deleteMeal(element._id).subscribe(
            data => {
              this.matSnackBar.open(data['status'], 'OK');
              this.dialogRef.close();
            },
            err => {
              console.log(err);
              this.matSnackBar.open('Some Error Occurred :' + err, 'OK');
            }
          );
        }
      });
    }
  }
}

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: '../../../common/cnf_dialog_component.html',
  styles: [``]
})
// tslint:disable-next-line:component-class-suffix
export class ConfirmationDialog {
  constructor(public cnfDialogRef: MatDialogRef<ConfirmationDialog>) {}
}
