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
  hasSeenIntro = false;
  typingTimeout: any;

  ngOnInit() {
    this.hasSeenIntro = sessionStorage.getItem('hasSeenIntro') === 'true';
    if (this.hasSeenIntro) {
      this.isSkipped = true;
      this.displayedText = '🎮 Let\'s go!';
    } else {
      this.typeCurrentLine();
    }
  }

  typeCurrentLine() {
    const line = this.lines[this.currentLineIndex];
    this.displayedText = '';
    this.isTyping = true;
    let charIndex = 0;
    const typingSpeed = 30;

    const typeNextChar = () => {
      if (this.isSkipped) {
        this.displayedText = '🎮 Let\'s go!';
        this.isTyping = false;
        return;
      }
      if (charIndex < line.length) {
        this.displayedText += line[charIndex];
        charIndex++;
        this.typingTimeout = setTimeout(typeNextChar, typingSpeed);
      } else {
        this.isTyping = false;
      }
    };

    typeNextChar();
  }

  skipIntro() {
    this.isSkipped = true;
    sessionStorage.setItem('hasSeenIntro', 'true');
    this.displayedText = '🎮 Let\'s go!';
    this.isTyping = false;
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
  }

  nextLine() {
    if (this.isTyping) return;

    if (this.currentLineIndex < this.lines.length - 1) {
      this.currentLineIndex++;
      this.typeCurrentLine();
    } else {
      this.displayedText = '🎮 Let\'s go!';
      sessionStorage.setItem('hasSeenIntro', 'true');
    }
  }
}
