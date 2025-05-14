import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { DashboardComponent } from 'app/modules/admin/biReporting/dashboard/dashboard.component';
import { DashboardService } from 'app/modules/admin/biReporting/dashboard/dashboard.service';

export default [
    {
        path: '',
        component: DashboardComponent,
        resolve: {
            data: () => inject(DashboardService).getData(),
            dataInfoX: () => inject(DashboardService).getDataInfoX(),
            dataExecutiveOverview: () => inject(DashboardService).getDataExecutiveOverview()
        },
    },
] as Routes;
