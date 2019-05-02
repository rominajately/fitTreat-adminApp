import { Component, OnInit } from '@angular/core';
import { MasterDataService } from '../master-data.service';
import { Medicine } from '../medicine';
import { Symptom } from '../symptom';
import { MatSnackBar } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-symptoms',
  templateUrl: './symptoms.component.html',
  styleUrls: ['./symptoms.component.css']
})
export class SymptomsComponent implements OnInit {
  searchText = '';
  // busy indicator set
  busy = false;
  // Flag to set new medicine to symptoms form
  addToSympCheck = false;

  // edit mode
  editMode = false;
  elementId: string;

  // Data Table Switch
  toolBtnMedicine = true;
  toolBtnSymptom = false;
  removable = true;
  medChips = [];
  listData: any[];
  medicineData: Medicine[];
  symptomsData: Symptom[];

  // Defining form controls

  symptomFormGrp = new FormGroup({
    sympName: new FormControl()
  });
  medicineFormGrp = new FormGroup({
    medName: new FormControl(),
    ingreds: new FormControl()
  });
  constructor(
    public masterDataSvc: MasterDataService,
    private matSnackBar: MatSnackBar
  ) {
    this.masterDataSvc.getAllMedicines().subscribe(
      result => {
        this.medicineData = result;
        this.listData = this.medicineData;
      },
      err => {
        console.error('Some error occurred : ' + err);
      }
    );
  }

  ngOnInit() {}

  remove(index: number): void {
    this.medChips.splice(index, 1);
  }

  switchToSymp() {
    this.toolBtnSymptom = true;
    this.toolBtnMedicine = false;
    this.masterDataSvc.getAllSymptoms().subscribe(
      result => {
        this.symptomsData = result;
        this.listData = this.symptomsData;
      },
      err => {
        console.error('Some error occurred : ' + err);
      }
    );
  }

  switchToMed() {
    this.toolBtnSymptom = false;
    this.toolBtnMedicine = true;
    this.masterDataSvc.getAllMedicines().subscribe(
      result => {
        this.medicineData = result;
        this.listData = this.medicineData;
      },
      err => {
        console.error('Some error occurred : ' + err);
      }
    );
  }

  onEditPress(selections, medForm, sympForm) {
    this.editMode = true;
    const selected = selections.selectedOptions.selected[0].value;
    this.elementId = selected._id;
    if (this.toolBtnMedicine) {
      // Medicine data is to be edited
      this.medicineFormGrp.controls.medName.setValue(selected.name);
      this.medicineFormGrp.controls.ingreds.setValue(
        selected.ingredients.toLocaleString()
      );
    } else {
      // Symptom data is to be edited
      this.medChips = [];
      this.symptomFormGrp.controls.sympName.setValue(selected.name);
      this.medChips = selected.medicines;
    }
  }

  addMedsToSympForm(meds: any) {
    this.medChips = [];
    meds.forEach(element => {
      this.medChips.push(element.value);
    });
  }

  deleteData(data: any) {
    const idArrs = [];
    data.forEach(element => {
      idArrs.push(element.value['_id']);
    });
    if (this.toolBtnMedicine) {
      // Medicine data is to be deleted
      this.masterDataSvc.deleteMedicines(idArrs).subscribe(
        result => {
          this.matSnackBar.open('Success', 'OK');
          this.masterDataSvc.getAllMedicines().subscribe(meds => {
            this.listData = meds;
          });
        },
        err => {
          console.error(err);
          this.matSnackBar.open('Some error occurred', 'OK');
        }
      );
    } else {
      // Symptom data is to be deleted
      this.masterDataSvc.deleteSymptoms(idArrs).subscribe(
        result => {
          this.matSnackBar.open('Success', 'OK');
          this.masterDataSvc.getAllSymptoms().subscribe(symptoms => {
            this.listData = symptoms;
          });
        },
        err => {
          console.error(err);
          this.matSnackBar.open('Some error occurred', 'OK');
        }
      );
    }
  }

  onSymptomsSave() {
    if (this.medChips.length) {
      const obj = new Symptom();
      obj.name = this.symptomFormGrp.controls.sympName.value;
      obj.medicines = this.medChips;
      if (this.editMode) {
        this.masterDataSvc.updateSymptom(obj, this.elementId).subscribe(
          result => {
            this.editMode = false;
            this.matSnackBar.open('Success', 'OK');
          },
          err => {
            console.error(err);
            this.matSnackBar.open('Some error occurred', 'OK');
          }
        );
      } else {
        this.masterDataSvc.addNewSymtom(obj).subscribe(
          result => {
            if (result.status) {
              this.matSnackBar.open(result.status, 'OK');
            } else {
              this.matSnackBar.open('Success', 'OK');
              this.masterDataSvc.getAllSymptoms().subscribe(symptoms => {
                this.listData = symptoms;
              });
            }
          },
          err => {
            console.error(err);
            this.matSnackBar.open('Some erro occurred : ' + err, 'OK');
          }
        );
      }
    } else {
      this.matSnackBar.open('At least one medicine is required', 'OK');
      return;
    }
  }

  onMedicineSave() {
    const obj = new Medicine();
    obj.name = this.medicineFormGrp.controls.medName.value;
    const ingredients = this.medicineFormGrp.controls.ingreds.value;
    obj.ingredients = ingredients.split(',');
    if (this.editMode) {
      this.masterDataSvc.updateMedicine(obj, this.elementId).subscribe(
        result => {
          this.editMode = false;
          this.matSnackBar.open('Success', 'OK');
        },
        err => {
          console.error(err);
          this.matSnackBar.open('Some error occurred', 'OK');
        }
      );
    } else {
      this.masterDataSvc.addNewMedicine(obj).subscribe(
        result => {
          if (result.status) {
            this.matSnackBar.open(result.status, 'OK');
          } else {
            this.matSnackBar.open('Success', 'OK');
            if (this.addToSympCheck) {
              this.medChips.push(result);
            }
            this.masterDataSvc.getAllMedicines().subscribe(meds => {
              this.listData = meds;
            });
          }
        },
        err => {
          console.error(err);
          this.matSnackBar.open('Some erro occurred : ' + err, 'OK');
        }
      );
    }
  }
}
