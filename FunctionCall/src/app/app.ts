import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Demo } from './demo/demo';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Demo ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // protected readonly title = signal('FunctionCall');
  count=0

  increment(){
    this.count=this.count+1;

  }
  decrement(){
    this.count=this.count-1;
  }
  reset(){
    this.count=0;
  }
 

}
