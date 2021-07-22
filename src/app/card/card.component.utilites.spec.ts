import {
  getCardIdle3dRotation,
  getCardRotationAxis,
  getCardRotationTurnsRatio,
  getDistanceFromCenter,
  getHypotenuse,
  getRelativeCursorPosition,
  MAX_TURNS,
} from "./card.component.utilities";

describe('CardComponent utilities', () => {
  describe('getCardIdle3dRotation()', () => {
    let top: number;
    let left: number;
    let height: number;
    let width: number;
    let boundingRectangle: { top: number, left: number, height: number, width: number }; 

    beforeEach(() => {
      top = Math.random();
      left = Math.random();
      height = Math.random() + 1;
      width = Math.random() + 1;
      boundingRectangle = { top, left, height, width };
    });

    describe('check axis', () => {
      it('should give an axis of 1, 0, 0 when the cursor is at the top', () => {
        const pageX = left + width / 2;
        const pageY = top;
        const cursorPosition = { pageX, pageY };

        const { x, y, z } = getCardIdle3dRotation(boundingRectangle, cursorPosition);

        expect(x).toBe(1);
        expect(y).toBeCloseTo(0);
        expect(z).toBe(0);
      });

      it('should give an axis of -1, 0, 0 when the cursor is at the bottom', () => {
        const pageX = left + width / 2;
        const pageY = top + height;
        const cursorPosition = { pageX, pageY };

        const { x, y, z } = getCardIdle3dRotation(boundingRectangle, cursorPosition);

        expect(x).toBe(-1);
        expect(y).toBeCloseTo(0);
        expect(z).toBe(0);
      });

      it('should give an axis with a large y value when the cursor is to the right', () => {
        const pageX = left + width;
        const pageY = top + height / 2;
        const cursorPosition = { pageX, pageY };

        const { x, y, z } = getCardIdle3dRotation(boundingRectangle, cursorPosition);

        expect(Math.abs(x)).toBe(1);
        expect(y).toBeGreaterThan(10000000);
        expect(z).toBe(0);
      });

      it('should give an axis with a large negative value when the cursor is to the left', () => {
        const pageX = left;
        const pageY = top + height / 2;
        const cursorPosition = { pageX, pageY };

        const { x, y, z } = getCardIdle3dRotation(boundingRectangle, cursorPosition);

        expect(Math.abs(x)).toBe(1);
        expect(y).toBeLessThan(-10000000);
        expect(z).toBe(0);
      });
    });

    describe('check turn amount', () => {
      let right: number;
      let bottom: number;
      let centerX: number;
      let centerY: number;

      beforeEach(() => {
        right = left + width;
        bottom = top + height;

        centerX = left + width / 2;
        centerY = top + height / 2;
      });

      it('should give a turn of 0 when cursor is at the center', () => {
        const pageX = left + width / 2;
        const pageY = top + height / 2;
        const cursorPosition = { pageX, pageY };
  
        const { turns } = getCardIdle3dRotation(boundingRectangle, cursorPosition);
  
        expect(turns).toBeCloseTo(0);
      });

      it('should return the absolute value of the ratio along the horizontal axis', () => {
        const pageY = top;
        height = 0;
        boundingRectangle = { top, left, height, width };
        const ratio = Math.random();
        const pageX = ratio * (right - centerX) + centerX;
        const cursorPosition = { pageX, pageY };
        const expectedTurns = MAX_TURNS * ratio;

        const { turns } = getCardIdle3dRotation(boundingRectangle, cursorPosition);
        expect(turns).toBeCloseTo(expectedTurns, 10);
      });

      it('should return the absolute value of the ratio along the vertical axis', () => {
        const pageX = left;
        width = 0;
        boundingRectangle = { top, left, height, width };
        const ratio = Math.random();
        const pageY = ratio * (bottom - centerY) + centerY;
        const cursorPosition = { pageX, pageY };
        const expectedTurns = MAX_TURNS * ratio;

        const { turns } = getCardIdle3dRotation(boundingRectangle, cursorPosition);
        expect(turns).toBeCloseTo(expectedTurns, 10);
      });
    });
  });

  describe('getRelativeCursorPosition()', () => {
    it('should return the distance from the top and left of the bounding box', () => {
      const top = Math.random();
      const left = Math.random();
      const boundingBox = { top, left };

      const pageX = Math.random();
      const pageY = Math.random();
      const cursorPagePosition = { pageX, pageY };

      const { x, y } = getRelativeCursorPosition(boundingBox, cursorPagePosition);

      expect(x).toBe(pageX - left);
      expect(y).toBe(pageY - top);
    });
  });

  describe('getCardRotationAxis()', () => {
    it('should return 1, 0, 0 when the cursor is exactly to the top', () => {
      const mockDistanceFromCenter = { x: 0, y: -1 };
      const { x, y, z } = getCardRotationAxis(mockDistanceFromCenter);

      expect(x).toBe(1);
      expect(y).toBeCloseTo(0);
      expect(z).toBe(0);
    });

    it('should return -1, 0, 0 when the cursor is exactly to the bottom', () => {
      const mockDistanceFromCenter = { x: 0, y: 1 };
      const { x, y, z } = getCardRotationAxis(mockDistanceFromCenter);

      expect(x).toBe(-1);
      expect(y).toBeCloseTo(0);
      expect(z).toBe(0);
    });

    it('should return a large y value when the cursor is exactly to the right', () => {
      const mockDistanceFromCenter = { x: 1, y: 0 };
      const { x, y, z } = getCardRotationAxis(mockDistanceFromCenter);

      expect(Math.abs(x)).toBe(1);
      expect(y).toBeGreaterThan(1000000);
      expect(z).toBe(0);
    });

    it('should return a large negative y value when the cursor is exactly to the left', () => {
      const mockDistanceFromCenter = { x: -1, y: 0 };
      const { x, y, z } = getCardRotationAxis(mockDistanceFromCenter);

      expect(Math.abs(x)).toBe(1);
      expect(y).toBeLessThan(-1000000);
      expect(z).toBe(0);
    });
  });

  describe('getCardRotationTurnsRatio()', () => {
    it('should return 0 when the distance from the center is 0, 0', () => {
      const mockDistanceFromCenter = { x: 0, y: 0 };
      const mockMaxDistanceFromCenter = { x: Math.random(), y: Math.random() };

      expect(getCardRotationTurnsRatio(mockDistanceFromCenter, mockMaxDistanceFromCenter)).toBe(0);
    });

    it('should return 0 when the maximum distance from the center is 0, 0', () => {
      const mockDistanceFromCenter = { x: Math.random(), y: Math.random() };
      const mockMaxDistanceFromCenter = { x: 0, y: 0 };

      expect(getCardRotationTurnsRatio(mockDistanceFromCenter, mockMaxDistanceFromCenter)).toBe(0);
    });

    it('should return 1 when the distance from the center is the same as the max', () => {
      const mockMaxDistanceFromCenter = { x: Math.random(), y: Math.random() };
      const mockDistanceFromCenter = mockMaxDistanceFromCenter;

      expect(getCardRotationTurnsRatio(mockDistanceFromCenter, mockMaxDistanceFromCenter)).toBe(1);
    });
  });

  describe('getDistanceFromCenter()', () => {
    it('should return 0, 0 when cursor is at the center', () => {
      const mockCardDimensions = {
        height: Math.random(),
        width: Math.random(),
      };

      const mockCursorPosition = {
        x: mockCardDimensions.width / 2,
        y: mockCardDimensions.height / 2,
      };

      const expectedValue = { x: 0, y: 0 };

      expect(getDistanceFromCenter(mockCardDimensions, mockCursorPosition)).toEqual(expectedValue);
    });

    it('should return half the height and width at bottom right corner', () => {
      const mockCardDimensions = {
        height: Math.random(),
        width: Math.random(),
      };

      const mockCursorPosition = {
        x: mockCardDimensions.width,
        y: mockCardDimensions.height,
      };

      const expectedValue = { x: mockCardDimensions.width / 2, y: mockCardDimensions.height / 2 };

      expect(getDistanceFromCenter(mockCardDimensions, mockCursorPosition)).toEqual(expectedValue);
    });

    it('should return negative half the height and width at the top left corner', () => {
      const mockCardDimensions = {
        height: Math.random(),
        width: Math.random(),
      };

      const mockCursorPosition = {
        x: 0,
        y: 0,
      };

      const expectedValue = { x: -mockCardDimensions.width / 2, y: -mockCardDimensions.height / 2 };

      expect(getDistanceFromCenter(mockCardDimensions, mockCursorPosition)).toEqual(expectedValue);
    });
  });

  describe('getHypotenuse()', () => {
    it('should return 0 when both lengths are 0', () => {
      expect(getHypotenuse(0, 0)).toBe(0);
    });

    it('should return the non-zero legnth if one length is 0', () => {
      expect(getHypotenuse(1, 0)).toBe(1);
      expect(getHypotenuse(0, 2)).toBe(2);
    });

    it('should follow the pythagorean theorem', () => {
      const a = 3;
      const b = 4;
      const c = 5;
      expect(getHypotenuse(a, b)).toBeCloseTo(c);
    });
  });
});
