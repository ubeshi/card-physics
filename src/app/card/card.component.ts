import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { getCardDragging3dRotation, getCardIdle3dRotation, isCursorInBoundingRectangle } from './card.component.utilities';

enum CardState {
  IDLE = 'idle',
  MOUSE_DOWN = 'mouse_down',
  DRAGGING = 'dragging',
};

export const MAX_DRAG_VELOCITY = 40;
const DRAG_VELOCITY_DECAY = 3;

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  cardState = CardState.IDLE;

  cardRotationStyle?: string;
  transitionSpeed?: string;

  draggingSpeed = {
    x: 0,
    y: 0,
  };

  mouseDownPosition = {
    x: 0,
    y: 0,
  };

  constructor(
    private elementRef: ElementRef,
  ) {

  }

  ngOnInit(): void {
    this.animate();
  }

  animate(): void {
    if (this.cardState === CardState.DRAGGING) {
      const { x, y } = this.draggingSpeed;

      const cursorMovement = {
        movementX: x,
        movementY: y,
      };

      const cardDraggingRotation = getCardDragging3dRotation(cursorMovement);
      this.cardRotationStyle = `rotate3d(${cardDraggingRotation.x}, ${cardDraggingRotation.y}, ${cardDraggingRotation.z}, ${cardDraggingRotation.turns}turn)`;
      this.transitionSpeed = '0.2s';

      let newX: number;
      if (x < 0) {
        if (x < -DRAG_VELOCITY_DECAY) {
          newX = x + DRAG_VELOCITY_DECAY;
        } else {
          newX = 0;
        }
      } else if (x > 0) {
        if (x > DRAG_VELOCITY_DECAY) {
          newX = x - DRAG_VELOCITY_DECAY;
        } else {
          newX = 0;
        }
      } else {
        newX = 0;
      }

      let newY: number;
      if (y < 0) {
        if (y < -DRAG_VELOCITY_DECAY) {
          newY = y + DRAG_VELOCITY_DECAY;
        } else {
          newY = 0;
        }
      } else if (y > 0) {
        if (y > DRAG_VELOCITY_DECAY) {
          newY = y - DRAG_VELOCITY_DECAY;
        } else {
          newY = 0;
        }
      } else {
        newY = 0;
      }
      
      this.draggingSpeed = {
        x: newX,
        y: newY,
      };
    }
    

    window.requestAnimationFrame(() => this.animate());
  }

  @HostListener('document:mousemove', ['$event'])
  handleMouseMove(event: MouseEvent): void {
    switch (this.cardState) {
      case CardState.IDLE:
        // set idle rotation
        const boundingRectangle = (this.elementRef.nativeElement as HTMLElement).getBoundingClientRect();
        if (isCursorInBoundingRectangle(boundingRectangle, event)) {
          const cardIdleRotation = getCardIdle3dRotation(boundingRectangle, event);
          this.cardRotationStyle = `rotate3d(${cardIdleRotation.x}, ${cardIdleRotation.y}, ${cardIdleRotation.z}, ${cardIdleRotation.turns}turn)`;
          this.transitionSpeed = '0s';
        }
        break;

      case CardState.MOUSE_DOWN:
        this.cardState = CardState.DRAGGING;
        // fall-through
      case CardState.DRAGGING:
        // set dragging rotation
        let newX = this.draggingSpeed.x += event.movementX;
        if (newX > MAX_DRAG_VELOCITY) {
          newX = MAX_DRAG_VELOCITY;
        }
        if (newX < -MAX_DRAG_VELOCITY) {
          newX = -MAX_DRAG_VELOCITY;
        }

        let newY = this.draggingSpeed.y += event.movementY;
        if (newY > MAX_DRAG_VELOCITY) {
          newY = MAX_DRAG_VELOCITY;
        }
        if (newY < -MAX_DRAG_VELOCITY) {
          newY = -MAX_DRAG_VELOCITY;
        }

        this.draggingSpeed = {
          x: newX,
          y: newY,
        };

        // move the card
        const top = event.pageY - this.mouseDownPosition.y;
        const left = event.pageX - this.mouseDownPosition.x;
        (this.elementRef.nativeElement as HTMLElement).style.top = `${top}px`;
        (this.elementRef.nativeElement as HTMLElement).style.left = `${left}px`;
        break;
    }
  }

  @HostListener('mouseleave', ['$event'])
  handleMouseLeave(_event: MouseEvent): void {
    switch (this.cardState) {
      case CardState.IDLE:
        this.cardRotationStyle = `rotate3d(0, 0, 0, 0)`;
        this.transitionSpeed = '1s';
        break;
      default:
        break;
    }
  }

  @HostListener('mousedown', ['$event'])
  handleMouseDown(event: MouseEvent): void {
    if (this.cardState === CardState.IDLE) {
      this.cardState = CardState.MOUSE_DOWN;
    }
    this.mouseDownPosition = {
      x: event.offsetX,
      y: event.offsetY,
    };
  }

  @HostListener('document:mouseup', ['$event'])
  handleMouseUp(_event: MouseEvent): void {
    if (this.cardState === CardState.DRAGGING) {
      this.cardRotationStyle = `rotate3d(0, 0, 0, 0)`;
      this.transitionSpeed = '1s';
    }
    this.cardState = CardState.IDLE;
  }

}
