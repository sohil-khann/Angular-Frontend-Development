import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LabelModel } from '../../models/label.models';

@Component({
  selector: 'app-keep-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './keep-sidebar.html',
  styleUrl: './keep-sidebar.scss'
})
export class KeepSidebar {
  @Input() labels: LabelModel[] | null = [];

  readonly primaryItems = [
    { label: 'Notes', path: '/home/notes', icon: 'lightbulb' },
    { label: 'Reminders', path: '/home/reminders', icon: 'bell' },
    { label: 'Edit labels', path: '/home/labels/manage', icon: 'edit' },
    { label: 'Archive', path: '/home/archive', icon: 'archive' },
    { label: 'Trash', path: '/home/trash', icon: 'trash' }
  ];

  readonly secondaryItems = [
    { label: 'Invitations', path: '/home/invitations' },
    { label: 'Sessions', path: '/home/sessions' }
  ];
}
