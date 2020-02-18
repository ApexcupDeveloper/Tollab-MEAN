import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    },
    {
        path: 'jobs',
        loadChildren: './jobs/jobs.module#JobsPageModule'
    },
    {
        path: 'coming-soon',
        loadChildren: './coming-soon/coming-soon.module#ComingSoonPageModule'
    },
    {
        path: 'companies',
        loadChildren: './companies/companies.module#CompaniesPageModule'
    },
    {
        path: 'profile-company',
        loadChildren: './profile-company/profile-company.module#ProfileCompanyPageModule'
    },
    {
        path: 'post',
        loadChildren: './post/post.module#PostPageModule'
    },
    {
        path: 'detail-job',
        loadChildren: './detail-job/detail-job.module#DetailJobPageModule'
    },
    {
        path: 'profile-employer',
        loadChildren: './profile-employer/profile-employer.module#ProfileEmployerPageModule'
    },
    {
        path: 'signup-employer',
        loadChildren: './signup-employer/signup-employer.module#SignupEmployerPageModule'
    },
    { 
        path: 'post-profile', 
        loadChildren: './post-profile/post-profile.module#PostProfilePageModule' 
    },
    { 
        path: 'confirm-email', 
        loadChildren: './confirm-email/confirm-email.module#ConfirmEmailPageModule' 
    },
    { 
        path: 'company-add', 
        loadChildren: './company-add/company-add.module#CompanyAddPageModule' 
    },
    { 
        path: 'chat', 
        loadChildren: './chat/chat.module#ChatPageModule' 
    },
    { 
        path: 'detail-employer', 
        loadChildren: './detail-employer/detail-employer.module#DetailEmployerPageModule' 
    },
    { 
        path: 'applied-job', 
        loadChildren: './applied-job/applied-job.module#AppliedJobPageModule' 
    },
    {
        path: '**',
        redirectTo: ''
    },
 
  
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            preloadingStrategy: PreloadAllModules,
            anchorScrolling: 'enabled',
            scrollPositionRestoration: 'top'
        })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
