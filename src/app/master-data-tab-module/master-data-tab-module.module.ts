import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterDataModuleRoutingModule } from './master-data-module-routing.module';
import { MasterDataComponent } from './master-data-home/master-data-home.component';
import { MealsComponent, MealsListDialog, ConfirmationDialog } from './meals/meals.component';
import {SymptomsComponent} from './symptoms/symptoms.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule, MatSortModule, MatInputModule, MatToolbarModule,
   MatSelectModule, MatDialogModule, MatProgressSpinnerModule, MatChipsModule, MatIconModule, MatCheckboxModule} from '@angular/material';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FilterPipe } from '../filter.pipe';


@NgModule({
  imports: [
    MatProgressSpinnerModule,
    MatDialogModule,
    ReactiveFormsModule,
    CommonModule,
    MasterDataModuleRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    FormsModule,
  MatSelectModule,
  MatChipsModule,
  MatIconModule,
  MatCheckboxModule
],
  declarations: [
    MasterDataComponent,
    MealsComponent,
    SymptomsComponent,
    FilterPipe,
    MealsListDialog,
    ConfirmationDialog,
      ],
    entryComponents: [
      MealsListDialog,
      ConfirmationDialog
    ],
    exports: []
})
export class MasterDataTabModule { }
