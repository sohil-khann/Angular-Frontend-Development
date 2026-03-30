import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Eventbindingdemo } from './eventbindingdemo/eventbindingdemo';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Eventbindingdemo],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  // Computer Lab takes TWO periods (columns)
  periodsInMorning: number = 2;
  // Assembly takes TWO time slots (rows)
  assemblyRowSpan: number = 2;
}
