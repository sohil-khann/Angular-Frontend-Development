import { Component } from '@angular/core';
import { OrdersDashboard } from '../app/orders-dashboard/orders-dashboard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [OrdersDashboard],
  templateUrl: './app.html',
})
export class App { }
