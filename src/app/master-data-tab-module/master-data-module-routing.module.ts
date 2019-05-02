import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MasterDataComponent} from './master-data-home/master-data-home.component'
import { MealsComponent } from './meals/meals.component';
import { SymptomsComponent } from './symptoms/symptoms.component';

const routes:Routes = [
  {path:'masterData',component:MasterDataComponent,
    children:[
      {path:'',redirectTo:'symptoms',pathMatch:'full'},
      {
        path:'meals',
        component:MealsComponent
      },
      {
        path:'symptoms',
        component:SymptomsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterDataModuleRoutingModule { }
