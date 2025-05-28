import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-intro',
  imports: [RouterLink, NgIf],
  templateUrl: './intro.component.html',
  styleUrl: './intro.component.scss',
  standalone: true,
})
export class IntroComponent {
  lines: string[] = [
    'In a city once built brick by brick by determined samsui women',
    'A new challenge rises — not on construction sites, but in the career jungle.',
    'Don your digital red headscarf. Step into a pixel world ',
    'Where interviews are boss battles, careers are quests, and your path is yours to forge.',
    'You are the next generation — bold, resilient, and Redy.'
  ];

  currentLineIndex = 0;
  displayedText = '';
  isTyping = false;
  isSkipped = false;

  ngOnInit() {
    this.typeCurrentLine();
  }

  typeCurrentLine() {
    const line = this.lines[this.currentLineIndex];
    this.displayedText = '';
    this.isTyping = true;

    let charIndex = 0;
    const typingSpeed = 30;

    const typeNextChar = () => {
      if (charIndex < line.length) {
        this.displayedText += line[charIndex];
        charIndex++;
        setTimeout(typeNextChar, typingSpeed);
      } else {
        this.isTyping = false;
      }
    };

    typeNextChar();
  }

  nextLine() {
    if (this.isTyping) return;

    if (this.currentLineIndex < this.lines.length - 1) {
      this.currentLineIndex++;
      this.typeCurrentLine();
    } else {
      this.displayedText = '🎮 Let\'s go!';
    }
  }
}
