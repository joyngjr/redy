import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-carousel',
  templateUrl: './home-carousel.component.html',
})
export class HomeCarouselComponent implements OnInit {
  images = [
    '/images/upload-resume.svg', // images to be replced
    '/images/customise-interview-settings.svg',
    '/images/press-to-start-interview.svg'
  ];
  captions = [
    'She worked hard under the hot sun in 1935.',
    'One day, she woke up... in 2025.',
    'Confused but determined, she starts learning to make a living.'
  ];
  currentIndex = 0;

  ngOnInit() {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, 4000); // slide every 4 seconds
  }
}

