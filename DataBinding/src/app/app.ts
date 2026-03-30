import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  // Computer Lab takes TWO periods (columns)
  periodsInMorning: number = 2;
  // Assembly takes TWO time slots (rows)
  assemblyRowSpan: number = 2;
}
