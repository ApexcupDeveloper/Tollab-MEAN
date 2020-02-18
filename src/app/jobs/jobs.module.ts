import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CardComponent } from './card/card.component'
import { IonicModule } from '@ionic/angular';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { JobsPage } from './jobs.page';
import { JwPaginationComponent } from 'jw-angular-pagination';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: JobsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    TranslateModule,
    Ng2SearchPipeModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  declarations: [JobsPage, CardComponent, JwPaginationComponent]
})
export class JobsPageModule { }
