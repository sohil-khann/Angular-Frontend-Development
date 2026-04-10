import { Routes } from '@angular/router';
import { authGuard } from './gaurd/auth.guard';
import { ChangePassword } from './pages/change-password/change-password';
import { ForgotPassword } from './pages/forgot-password/forgot-password';
import { Invitations } from './pages/invitations/invitations';
import { KeepShell } from './pages/keep-shell/keep-shell';
import { Login } from './pages/login/login';
import { ManageLabels } from './pages/manage-labels/manage-labels';
import { NotesCollection } from './pages/notes-collection/notes-collection';
import { ResendVerification } from './pages/resend-verification/resend-verification';
import { ResetPassword } from './pages/reset-password/reset-password';
import { Sessions } from './pages/sessions/sessions';
import { Signup } from './pages/signup/signup';
import { VerifyEmail } from './pages/verify-email/verify-email';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'register', component: Signup, title: 'Fundoo - Register' },
  { path: 'login', component: Login, title: 'Fundoo - Login' },
  { path: 'forgot-password', component: ForgotPassword, title: 'Fundoo - Forgot Password' },
  { path: 'reset-password', component: ResetPassword, title: 'Fundoo - Reset Password' },
  {
    path: 'resend-verification',
    component: ResendVerification,
    title: 'Fundoo - Resend Verification'
  },
  { path: 'verify-email', component: VerifyEmail, title: 'Fundoo - Verify Email' },
  {
    path: 'home',
    component: KeepShell,
    canActivate: [authGuard],
    title: 'Fundoo - Notes',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'notes' },
      { path: 'notes', component: NotesCollection, title: 'Fundoo - Notes', data: { view: 'notes' } },
      {
        path: 'reminders',
        component: NotesCollection,
        title: 'Fundoo - Reminders',
        data: { view: 'reminders' }
      },
      {
        path: 'archive',
        component: NotesCollection,
        title: 'Fundoo - Archive',
        data: { view: 'archive' }
      },
      { path: 'trash', component: NotesCollection, title: 'Fundoo - Trash', data: { view: 'trash' } },
      {
        path: 'labels/manage',
        component: ManageLabels,
        title: 'Fundoo - Manage Labels'
      },
      {
        path: 'labels/:labelId',
        component: NotesCollection,
        title: 'Fundoo - Label',
        data: { view: 'label' }
      },
      {
        path: 'invitations',
        component: Invitations,
        title: 'Fundoo - Invitations'
      },
      {
        path: 'sessions',
        component: Sessions,
        title: 'Fundoo - Sessions'
      }
    ]
  },
  {
    path: 'change-password',
    component: ChangePassword,
    canActivate: [authGuard],
    title: 'Fundoo - Change Password'
  },
  { path: '**', redirectTo: 'login' }
];
