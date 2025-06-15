import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-intro',
  imports: [RouterLink, NgIf, NgClass],
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
  final_text = 'Are you Redy?';

  ngOnInit() {
    this.hasSeenIntro = sessionStorage.getItem('hasSeenIntro') === 'true';
    if (this.hasSeenIntro) {
      this.skipIntro();
    } else {
      this.typeCurrentLine();
    }
  }

  skipIntro() {
    this.isSkipped = true;
    this.displayedText = this.final_text;
    this.isTyping = false;
    sessionStorage.setItem('hasSeenIntro', 'true');
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = null;
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
        this.skipIntro();
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

  nextLine() {
    if (this.isTyping) return;

    if (this.currentLineIndex < this.lines.length - 1) {
      this.currentLineIndex++;
      this.typeCurrentLine();
    } else {
      this.skipIntro();
    }
  }
}
