export interface Rotate3d extends Rotate3dAxis {
  angle: string;
}

export interface Rotate3dAxis {
  x: number;
  y: number;
  z: number;
}

export const MAX_TURNS = 0.1;

export function getCard3dRotation(boundingRectangle: DOMRect, cursorPosition: { pageX: number, pageY: number}): Rotate3d {
  const { top, bottom, right, left } = boundingRectangle;

  const centerX = (right + left) / 2;
  const centerY = (top + bottom) / 2;

  const distanceFromCenterX = cursorPosition.pageX - centerX;
  const distanceFromCenterY = cursorPosition.pageY - centerY;

  const distanceFromCenter = getHypotenuse(cursorPosition.pageX - centerX, cursorPosition.pageY - centerY);
  const maxDistanceFromCenter = getHypotenuse(right - centerX, bottom - centerY);
  const turns = MAX_TURNS * distanceFromCenter / maxDistanceFromCenter;

  const axis = getCardRotationAxis(distanceFromCenterX, distanceFromCenterY);

  return {
    ...axis,
    angle: `${turns}turn`,
  };
}

export function getCardRotationAxis(distanceFromCenterX: number, distanceFromCenterY: number): Rotate3dAxis {
  // The axis needs to be perpendicular to the vector created by the distance from the center, v_c
  // First we calculate the angle of v_c
  const angleFromCenter = Math.atan2(distanceFromCenterY, distanceFromCenterX);

  // Add a quarter circle to get the perpendicular angle (a full circle is 2 pi)
  const axisAngle = angleFromCenter - Math.PI / 2;

  // Compute the axis vector ratio
  const axisVectorRatio = Math.tan(axisAngle);

  const axisX = 1;
  const axisY = axisVectorRatio;

  return {
    x: axisX,
    y: axisY,
    z: 0,
  };
}

export function getHypotenuse(a: number, b: number): number {
  return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}
