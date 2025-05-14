/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'prod1',
        title: 'WhatsApp Chatbot',
        type: 'collapsable',
        customIcon: 'images/logo/logoCX-on-dark.png',
        children: [
            {
                id: 'dashboard',
                title: 'Dashboard',
                type: 'basic',
                icon: 'space_dashboard',
                link: '/dashboard'
            },
            {
                id: 'agents-chats',
                title: 'Agents Chats',
                type: 'basic',
                icon: 'heroicons_outline:chat-bubble-oval-left-ellipsis',
                link: '/agents-chats'
            },
            {
                id: 'reports',
                title: 'My Reports',
                type: 'collapsable',
                icon: 'mat_solid:area_chart',
                children: [
                    {
                        id: 'abandoned-users',
                        title: 'Abandoned Users',
                        type: 'basic',
                        icon: 'feather:user-x',
                        link: '/abandoned-users'
                    },
                    {
                        id: 'abandoned-users-messaged',
                        title: 'Abandoned Users Messaged',
                        type: 'basic',
                        icon: 'feather:user-minus',
                        link: '/abandoned-users-messaged'
                    },
                    {
                        id: 'agent-kpi-report',
                        title: 'Agent Kpi Report',
                        type: 'basic',
                        icon: 'heroicons_outline:presentation-chart-line',
                        link: '/agent-kpi-report'
                    },
                    {
                        id: 'agent-productivity-report',
                        title: 'Agent Productivity Report',
                        type: 'basic',
                        icon: 'heroicons_outline:document-chart-bar',
                        link: '/agent-productivity-report'
                    },
                    {
                        id: 'active-users',
                        title: 'Active Users',
                        type: 'basic',
                        icon: 'heroicons_outline:user-group',
                        link: '/active-users'
                    },
                    {
                        id: 'call-back-report',
                        title: 'Call Back Report',
                        type: 'basic',
                        icon: 'heroicons_outline:phone',
                        link: '/call-back-report'
                    },
                    {
                        id: 'debit-order-arrangements',
                        title: 'Debit Order Arrangements',
                        type: 'basic',
                        icon: 'heroicons_outline:currency-dollar',
                        link: '/debit-order-arrangements'
                    },
                    {
                        id: 'ozow-payments',
                        title: 'Ozow Payments',
                        type: 'basic',
                        icon: 'payments',
                        link: '/ozow-payments'
                    },
                    {
                        id: 'payfast-payments',
                        title: 'Payfast Payments',
                        type: 'basic',
                        icon: 'heroicons_outline:credit-card',
                        link: '/payfast-payments'
                    },
                    {
                        id: 'document-upload-report',
                        title: 'Document Upload Report',
                        type: 'basic',
                        icon: 'mat_outline:upload_file',
                        link: '/document-upload-report'
                    },
                    {
                        id: 'total-users',
                        title: 'Total Users',
                        type: 'basic',
                        icon: 'heroicons_outline:users',
                        link: '/total-users'
                    },
                    {
                        id: 'total-arrangements',
                        title: 'Total Arrangements',
                        type: 'basic',
                        icon: 'mat_outline:settings_input_component',
                        link: '/total-arrangements'
                    }
                ]
            },
            {
                id: 'profile',
                title: 'My Profile',
                type: 'basic',
                icon: 'heroicons_outline:user-circle',
                link: '/profile'
            },
            {
                id: 'users',
                title: 'Users',
                type: 'basic',
                icon: 'heroicons_outline:user',
                link: '/users'
            },
            {
                id: 'notifications',
                title: 'Notifications',
                type: 'basic',
                icon: 'heroicons_outline:bell',
                link: '/notifications'
            }
        ]
    },
    {
        id: 'prod2',
        title: 'Scoring',
        type: 'collapsable',
        customIcon: 'images/logo/logoSI-on-dark.png',
        children: [

        ]
    },
    {
        id: 'prod3',
        title: 'Document Xchange',
        type: 'collapsable',
        customIcon: 'images/logo/logoDX-on-dark.png',
        children: [

        ]
    },
    {
        id: 'prod4',
        title: 'BI Reporting',
        type: 'collapsable',
        customIcon: 'images/logo/logoBI-on-dark.png',
        children: [
            // {
            //     id: 'dashboard-bi',
            //     title: 'Dashboard',
            //     type: 'basic',
            //     icon: 'space_dashboard',
            //     link: '/dashboard-bi'
            // },
            {
                // id: 'reports',
                // title: 'My Reports',
                // type: 'collapsable',
                // icon: 'mat_solid:area_chart',
                // children: [{
                    id: 'executive-overview',
                    title: 'Executive Overview',
                    type: 'basic',
                    icon: 'heroicons_outline:chart-bar', // Reflects analytics/summary
                    link: '/executive-overview'
                },
                {
                    id: 'portfolio-overview',
                    title: 'Portfolio Overview',
                    type: 'basic',
                    icon: 'heroicons_outline:briefcase', // Suitable for portfolio/management
                    link: '/portfolio-overview'
                },
                {
                    id: 'engagement-breakdown',
                    title: 'Engagement Breakdown',
                    type: 'basic',
                    icon: 'heroicons_outline:chat-bubble-left-right', // Reflects interactions/engagement
                    link: '/engagement-breakdown'
                },
                {
                    id: 'calls-vs-arrangements',
                    title: 'Calls vs Arrangements',
                    type: 'basic',
                    icon: 'heroicons_outline:phone-arrow-up-right', // Reflects call activity
                    link: '/calls-vs-arrangements'
                }
                // ]
            // }
        ]
    },
    {
        id: 'prod5',
        title: 'Configuration',
        type: 'collapsable',
        icon: 'heroicons_outline:lock-closed',
        // allowedUsers: ['cfaad35d-07a3-4447-a6c3-d8c3d54fd5df'],
        children: [
            {
                id: 'configuration',
                title: 'Configuration',
                type: 'basic',
                icon: 'heroicons_outline:lock-closed',
                link: '/configuration',
                // allowedUsers: ['cfaad35d-07a3-4447-a6c3-d8c3d54fd5df']
            }
        ]
    },
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example'
    }
];
