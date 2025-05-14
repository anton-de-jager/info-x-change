import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/dashboard'
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },

    // Redirect signed-in user to the '/dashboard'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'dashboard' },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.routes') },
            { path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.routes') },
            { path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.routes') },
            { path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes') },
            { path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.routes') }
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes') },
            { path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.routes') }
        ]
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'home', loadChildren: () => import('app/modules/landing/home/home.routes') },
        ]
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            { path: 'configuration', loadChildren: () => import('app/modules/admin/configuration/configuration.routes') },
            { path: 'agents-chats', loadChildren: () => import('app/modules/admin/whatsAppChatBot/agents-chats/agents-chats.routes') },
            { path: 'dashboard', loadChildren: () => import('app/modules/admin/whatsAppChatBot/dashboard/dashboard.routes') },
            { path: 'abandoned-users', loadChildren: () => import('app/modules/admin/whatsAppChatBot/reports/abandoned-users/abandoned-users.routes') },
            { path: 'abandoned-users-messaged', loadChildren: () => import('app/modules/admin/whatsAppChatBot/reports/abandoned-users-messaged/abandoned-users-messaged.routes') },
            { path: 'agent-kpi-report', loadChildren: () => import('app/modules/admin/whatsAppChatBot/reports/agent-kpi-report/agent-kpi-report.routes') },
            { path: 'agent-productivity-report', loadChildren: () => import('app/modules/admin/whatsAppChatBot/reports/agent-productivity-report/agent-productivity-report.routes') },
            { path: 'active-users', loadChildren: () => import('app/modules/admin/whatsAppChatBot/reports/active-users/active-users.routes') },
            { path: 'call-back-report', loadChildren: () => import('app/modules/admin/whatsAppChatBot/reports/call-back-report/call-back-report.routes') },
            { path: 'debit-order-arrangements', loadChildren: () => import('app/modules/admin/whatsAppChatBot/reports/debit-order-arrangements/debit-order-arrangements.routes') },
            { path: 'ozow-payments', loadChildren: () => import('app/modules/admin/whatsAppChatBot/reports/ozow-payments/ozow-payments.routes') },
            { path: 'payfast-payments', loadChildren: () => import('app/modules/admin/whatsAppChatBot/reports/payfast-payments/payfast-payments.routes') },
            { path: 'document-upload-report', loadChildren: () => import('app/modules/admin/whatsAppChatBot/reports/document-upload-report/document-upload-report.routes') },
            { path: 'total-users', loadChildren: () => import('app/modules/admin/whatsAppChatBot/reports/total-users/total-users.routes') },
            { path: 'total-arrangements', loadChildren: () => import('app/modules/admin/whatsAppChatBot/reports/total-arrangements/total-arrangements.routes') },
            { path: 'profile', loadChildren: () => import('app/modules/admin/profile/profile.routes') },
            { path: 'users', loadChildren: () => import('app/modules/admin/whatsAppChatBot/users/users.routes') },
            { path: 'notifications', loadChildren: () => import('app/modules/admin/whatsAppChatBot/notifications/notifications.routes') },

            { path: 'dashboard-bi', loadChildren: () => import('app/modules/admin/biReporting/dashboard/dashboard.routes') },
            { path: 'calls-vs-arrangements', loadChildren: () => import('app/modules/admin/biReporting/reports/calls-vs-arrangements/calls-vs-arrangements.routes') },
            { path: 'executive-overview', loadChildren: () => import('app/modules/admin/biReporting/reports/executive-overview/executive-overview.routes') },
            { path: 'portfolio-overview', loadChildren: () => import('app/modules/admin/biReporting/reports/portfolio-overview/portfolio-overview.routes') },
            { path: 'engagement-breakdown', loadChildren: () => import('app/modules/admin/biReporting/reports/engagement-breakdown/engagement-breakdown.routes') },
        ]
    }
];
