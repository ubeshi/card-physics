import { Component, ElementRef, HostListener } from '@angular/core';
import { getCard3dRotation, Rotate3d } from './card.component.utilities';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  mouseMoveX?: number;
  mouseMoveY?: number;

  cardRotationStyle?: string;
  transitionSpeed?: string;

  constructor(
    private elementRef: ElementRef,
  ) {

  }

  @HostListener('mousemove', ['$event'])
  handleMouseMove(event: MouseEvent): void {
    this.mouseMoveX = event.pageX;
    this.mouseMoveY = event.pageY;
    const boundingRectangle = (this.elementRef.nativeElement as HTMLElement).getBoundingClientRect();

    const cardRotation = getCard3dRotation(boundingRectangle, event);
    this.cardRotationStyle = `rotate3d(${cardRotation.x}, ${cardRotation.y}, ${cardRotation.z}, ${cardRotation.angle})`;
    this.transitionSpeed = '0s';
  }

  @HostListener('mouseleave', ['$event'])
  handleMouseLeave(_event: MouseEvent): void {
    this.cardRotationStyle = `rotate3d(0, 0, 0, 0)`;
    this.transitionSpeed = '1s';
  }

}
