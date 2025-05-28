import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IntroComponent } from '../intro/intro.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, IntroComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
})
export class HomeComponent {

}
