import { Component, OnInit } from '@angular/core';
import { CommonsvcService } from '../commonsvc.service';
import * as XLSX from 'xlsx';
import * as $ from 'jquery';
import { MatSnackBar } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { debug } from 'util';
import { Medicine } from '../master-data-tab-module/medicine';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(
    public dataSvc: CommonsvcService,
    public matSnackBar: MatSnackBar
  ) {
    this.dbStatSet();
  }
  dbStat: any = {
    users: 0,
    meals: 0,
    medicines: 0,
    symptoms: 0
  };
  bulkOptions = [
    { name: 'Meals', type: 'Excel' },
    { name: 'Medicines', type: 'JSON' },
    { name: 'Symptoms', type: 'JSON' }
  ];
  refreshClicked = false;

  deleteCollections = new FormControl('', [Validators.required]);

  dbStatRefresh() {
    if (!this.refreshClicked) {
      this.refreshClicked = true;
      this.dbStatSet();
    }
  }

  dbStatSet() {
    this.dataSvc.databaseStat().subscribe(
      result => {
        this.dbStat = result;
        this.refreshClicked = false;
      },
      err => {
        console.error(err);
      }
    );
  }
  ngOnInit() {}

  onTemplateDownload(type) {
    this.dataSvc.downloadTemplate(type);
  }

  deleteCollection(evt) {
    this.dataSvc.dropCollections(evt.value).subscribe(
      result => {
        console.log('Collection Drop Service : ' + result);
        this.dbStatRefresh();
        evt.value = '';
        this.matSnackBar.open('Success', 'OK');
      },
      err => {
        console.error(err);
        this.matSnackBar.open('Some error occurred', 'OK');
        evt.value = '';
      }
    );
  }

  fileUploadEvent(file) {
    let fileType = '';
    const radioGrp = document.getElementsByName('options');
    let selectedRadio: string;
    $.each(radioGrp, (i, v) => {
      if (v.checked) {
        selectedRadio = v.id;
        if (v.id === 'mealsRadio') {
          fileType = 'xlsx';
        } else {
          fileType = 'json';
        }
      }
    });
    file = file[0];
    const fileName = file.name;
    if (fileName.indexOf(fileType) < 0) {
      let allowdFile = '';
      if (fileType === 'xlsx') {
        allowdFile = 'Excel';
      } else {
        allowdFile = 'JSON';
      }
      this.matSnackBar.open(
        'Only ' + allowdFile + ' is allowed for the selection',
        'OK'
      );
      return;
    }
    const fileReader = new FileReader();
    if (fileType === 'xlsx') {
      fileReader.readAsArrayBuffer(file);
    } else if (fileType === 'json') {
      fileReader.readAsText(file);
    } else {
      this.matSnackBar.open('Unsupported file format', 'OK');
      return;
    }

    fileReader.onload = (evt: any) => {
      let dataArray = [];
      if (fileType === 'xlsx') {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, {
          type: 'array',
          cellDates: true,
          cellNF: false,
          cellText: false
        });
        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets.Sheet1);
        $.each(jsonData, (i, v) => {
          if (v.name) {
            const jsonObj = {
              name: v.name,
              cuisine: v.cuisine || '',
              calories: v.calories || 0,
              servingSize: v.servingSize || 0,
              nutritionInfo: v.nutritionInfo  || '',
              ingredients: v.ingredients  || '',
              directions: v.directions  || '',
              photoURL: v.photoURL || '',
              foodPreference: v.foodPreference
            };
            if (v['dietType']) {
              jsonObj['dietType'] = v['dietType'].split(',');
            } else {
              jsonObj['dietType'] = ['No Data Available'];
            }
            if (v['idealMedCond']) {
              jsonObj['idealMedCond'] = v['idealMedCond'].split(',');
            } else {
              jsonObj['idealMedCond'] = [];
            }
            if (v['avoidableMedCond']) {
              jsonObj['avoidableMedCond'] = v['avoidableMedCond'].split(',');
            } else {
              jsonObj['avoidableMedCond'] = [];
            }
            if (v['course']) {
              jsonObj['course'] = v['course'].split(',');
            } else {
              jsonObj['course'] = 'Snack';
            }
            dataArray.push(jsonObj);
          }
        });
      } else if (fileType === 'json') {
        try {
          dataArray = JSON.parse(evt.target.result);
        } catch (e) {
          console.error(e);
          this.matSnackBar.open(
            'Error in reading file. Check console for errors',
            'OK'
          );
        }
      }
      if (selectedRadio === 'mealsRadio') {
        this.dataSvc.uploadMealData(dataArray).subscribe(result => {
          this.dbStatRefresh();
          this.matSnackBar.open('Success', 'OK');
        });
      } else if (selectedRadio === 'medsRadio') {
        this.dataSvc.uploadMedicines(dataArray).subscribe(result => {
          this.dbStatRefresh();
          this.matSnackBar.open('Success', 'OK');
        });
      } else if (selectedRadio === 'sympRadio') {
        this.dataSvc.uploadSymptoms(dataArray).subscribe(result => {
          this.dbStatRefresh();
          this.matSnackBar.open('Success', 'OK');
        });
      }
    };
  }
}
