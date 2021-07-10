export interface Rotate3d extends Vector3d {
  turns: number;
}

export interface Vector3d {
  x: number;
  y: number;
  z: number;
}

export interface Vector2d {
  x: number;
  y: number;
}

export interface CursorPosition {
  pageX: number;
  pageY: number;
}

export const MAX_TURNS = 0.1;

export function getCard3dRotation(boundingRectangle: { top: number, left: number, width: number, height: number }, cursorPosition: CursorPosition): Rotate3d {
  const relativeCursorPosition = getRelativeCursorPosition(boundingRectangle, cursorPosition);
  const distanceFromCenter = getDistanceFromCenter(boundingRectangle, relativeCursorPosition);
  const maxDistanceFromCenter = getDistanceFromCenter(boundingRectangle, { x: 0, y: 0 });

  const axis = getCardRotationAxis(distanceFromCenter);
  const turns = MAX_TURNS * getCardRotationTurnsRatio(distanceFromCenter, maxDistanceFromCenter);
  return {
    ...axis,
    turns,
  };
}

export function getRelativeCursorPosition(boundingRectangle: { top: number, left: number }, cursorPosition: CursorPosition): Vector2d {
  const { top, left } = boundingRectangle;
  const { pageX, pageY } = cursorPosition;

  return {
    x: pageX - left,
    y: pageY - top,
  };
}

export function getCardRotationAxis(distanceFromCenter: Vector2d): Vector3d {
  // The axis needs to be perpendicular to the vector created by the distance from the center, v_c
  // First we calculate the angle of v_c
  const angleFromCenter = Math.atan2(distanceFromCenter.y, distanceFromCenter.x);

  // Add a quarter circle to get the perpendicular angle
  let axisAngle = angleFromCenter + Math.PI / 2;

  // Compute the axis vector ratio
  const axisVectorRatio = Math.tan(axisAngle);

  // If cursor is to the top, axisX should be positive to turn the card upwards
  // If cursor is to the bottom, axisX should be negative to turn the card downwards
  const axisX = distanceFromCenter.y <= 0 ? 1 : -1;

  // If cursor is to the right, axisY should be positive to turn the card to the right
  // If cursor is to the left, axisY should be negative to turn the card to the left
  const axisY = distanceFromCenter.x > 0 ? Math.abs(axisVectorRatio) : -Math.abs(axisVectorRatio);

  return {
    x: axisX,
    y: axisY,
    z: 0,
  };
}

export function getCardRotationTurnsRatio(distanceFromCenter: Vector2d, maxDistanceFromCenter: Vector2d): number {
  const maxDistance = getHypotenuse(maxDistanceFromCenter.x, maxDistanceFromCenter.y);

  if (maxDistance === 0) {
    return 0;
  }

  const cursorDistance = getHypotenuse(distanceFromCenter.x, distanceFromCenter.y);
  return cursorDistance / maxDistance;
}

export function getDistanceFromCenter(cardDimensions: { height: number, width: number }, relativeCursorPosition: Vector2d): Vector2d {
  const { height, width } = cardDimensions;
  const { x, y } = relativeCursorPosition;

  return {
    x: x - width / 2,
    y: y - height / 2,
  };
}

export function getHypotenuse(a: number, b: number): number {
  return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}
