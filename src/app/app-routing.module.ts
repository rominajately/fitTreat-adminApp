import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AppDataManagementComponent } from './app-data-management/app-data-management.component';

const routes:Routes = [
  {path:'',redirectTo:'home',pathMatch:'full'},
  {path:'home',component:HomeComponent},
  {path: 'masterData',loadChildren: './master-data-tab-module/master-data-tab-module.module#MasterDataTabModule'},
  {path:'appData',component:AppDataManagementComponent}
];

@NgModule({
  imports:[RouterModule.forRoot(routes)],
  exports:[RouterModule]
})
export class AppRoutingModule { 
}
