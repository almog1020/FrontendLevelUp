import type {StatsCard} from "../interfaces/statsCard.interface.ts";
import user from '../assets/users.png'
import activeUser from '../assets/activeUsers.png'
import suspendedUsers from '../assets/suspendedUsers.png'
import admin from '../assets/admin.png'

export const statCards:StatsCard[] = [
    {
      title:'Total Users',
      value:'5',
      icon:user
    },
    {
        title:'Active Users',
        value:'5',
        icon:activeUser
    },
    {
        title:'Suspended',
        value:'5',
        icon:suspendedUsers
    },
    {
        title:'Admins',
        value:'5',
        icon:admin
    }
]