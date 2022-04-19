/**
 * @file: ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

export type Point3D = { x: number; y: number; z: number };
export type Vector3D = [number, number, number, number];

export type Matrix3D = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

export function createIdentityMatrix(): Matrix3D {
  'worklet';
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}

export function createCopy(m: Matrix3D) {
  'worklet';
  return [
    m[0],
    m[1],
    m[2],
    m[3],
    m[4],
    m[5],
    m[6],
    m[7],
    m[8],
    m[9],
    m[10],
    m[11],
    m[12],
    m[13],
    m[14],
    m[15],
  ];
}

export function createOrthographic(
  left: number,
  right: number,
  bottom: number,
  top: number,
  near: number,
  far: number,
) {
  'worklet';
  const a = 2 / (right - left);
  const b = 2 / (top - bottom);
  const c = -2 / (far - near);

  const tx = -(right + left) / (right - left);
  const ty = -(top + bottom) / (top - bottom);
  const tz = -(far + near) / (far - near);

  return [a, 0, 0, 0, 0, b, 0, 0, 0, 0, c, 0, tx, ty, tz, 1] as Matrix3D;
}

export function createFrustum(
  left: number,
  right: number,
  bottom: number,
  top: number,
  near: number,
  far: number,
): Matrix3D {
  'worklet';
  const r_width = 1 / (right - left);
  const r_height = 1 / (top - bottom);
  const r_depth = 1 / (near - far);
  const x = 2 * (near * r_width);
  const y = 2 * (near * r_height);
  const A = (right + left) * r_width;
  const B = (top + bottom) * r_height;
  const C = (far + near) * r_depth;
  const D = 2 * (far * near * r_depth);
  return [x, 0, 0, 0, 0, y, 0, 0, A, B, C, -1, 0, 0, D, 0];
}

/**
 * This create a perspective projection towards negative z
 * Clipping the z range of [-near, -far]
 *
 * @param fovInRadians - field of view in radians
 */
export function createPerspective(
  fovInRadians: number,
  aspect: number,
  near: number,
  far: number,
): Matrix3D {
  'worklet';
  const h = 1 / Math.tan(fovInRadians / 2);
  const r_depth = 1 / (near - far);
  const C = (far + near) * r_depth;
  const D = 2 * (far * near * r_depth);
  return [h / aspect, 0, 0, 0, 0, h, 0, 0, 0, 0, C, -1, 0, 0, D, 0];
}

export function createTranslate2d(x: number, y: number) {
  'worklet';
  const mat = createIdentityMatrix();
  reuseTranslate2dCommand(mat, x, y);
  return mat;
}

export function reuseTranslate2dCommand(
  matrixCommand: Matrix3D,
  x: number,
  y: number,
) {
  'worklet';
  matrixCommand[12] = x;
  matrixCommand[13] = y;
}

export function reuseTranslate3dCommand(
  matrixCommand: Matrix3D,
  x: number,
  y: number,
  z: number,
) {
  'worklet';
  matrixCommand[12] = x;
  matrixCommand[13] = y;
  matrixCommand[14] = z;
}

export function createScale(factor: number) {
  'worklet';
  const mat = createIdentityMatrix();
  reuseScaleCommand(mat, factor);
  return mat;
}

export function reuseScaleCommand(matrixCommand: Matrix3D, factor: number) {
  'worklet';
  matrixCommand[0] = factor;
  matrixCommand[5] = factor;
}

export function reuseScale3dCommand(
  matrixCommand: Matrix3D,
  x: number,
  y: number,
  z: number,
) {
  'worklet';
  matrixCommand[0] = x;
  matrixCommand[5] = y;
  matrixCommand[10] = z;
}

export function reusePerspectiveCommand(matrixCommand: Matrix3D, p: number) {
  'worklet';
  matrixCommand[11] = -1 / p;
}

export function reuseScaleXCommand(matrixCommand: Matrix3D, factor: number) {
  'worklet';
  matrixCommand[0] = factor;
}

export function reuseScaleYCommand(matrixCommand: Matrix3D, factor: number) {
  'worklet';
  matrixCommand[5] = factor;
}

export function reuseScaleZCommand(matrixCommand: Matrix3D, factor: number) {
  'worklet';
  matrixCommand[10] = factor;
}

export function reuseRotateXCommand(matrixCommand: Matrix3D, radians: number) {
  'worklet';
  matrixCommand[5] = Math.cos(radians);
  matrixCommand[6] = Math.sin(radians);
  matrixCommand[9] = -Math.sin(radians);
  matrixCommand[10] = Math.cos(radians);
}

export function reuseRotateYCommand(matrixCommand: Matrix3D, amount: number) {
  'worklet';
  matrixCommand[0] = Math.cos(amount);
  matrixCommand[2] = -Math.sin(amount);
  matrixCommand[8] = Math.sin(amount);
  matrixCommand[10] = Math.cos(amount);
}

// http://www.w3.org/TR/css3-transforms/#recomposing-to-a-2d-matrix
export function reuseRotateZCommand(matrixCommand: Matrix3D, radians: number) {
  'worklet';
  matrixCommand[0] = Math.cos(radians);
  matrixCommand[1] = Math.sin(radians);
  matrixCommand[4] = -Math.sin(radians);
  matrixCommand[5] = Math.cos(radians);
}

export function createRotateZ(radians: number) {
  'worklet';
  const mat = createIdentityMatrix();
  reuseRotateZCommand(mat, radians);
  return mat;
}

export function reuseSkewXCommand(matrixCommand: Matrix3D, radians: number) {
  'worklet';
  matrixCommand[4] = Math.tan(radians);
}

export function reuseSkewYCommand(matrixCommand: Matrix3D, radians: number) {
  'worklet';
  matrixCommand[1] = Math.tan(radians);
}

export function multiplyInto(out: Matrix3D, a: Matrix3D, b: Matrix3D) {
  'worklet';
  const a00 = a[0],
    a01 = a[1],
    a02 = a[2],
    a03 = a[3],
    a10 = a[4],
    a11 = a[5],
    a12 = a[6],
    a13 = a[7],
    a20 = a[8],
    a21 = a[9],
    a22 = a[10],
    a23 = a[11],
    a30 = a[12],
    a31 = a[13],
    a32 = a[14],
    a33 = a[15];

  let b0 = b[0],
    b1 = b[1],
    b2 = b[2],
    b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

  b0 = b[4];
  b1 = b[5];
  b2 = b[6];
  b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

  b0 = b[8];
  b1 = b[9];
  b2 = b[10];
  b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

  b0 = b[12];
  b1 = b[13];
  b2 = b[14];
  b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
}

export function determinant(matrix: Matrix3D): number {
  'worklet';
  const m00 = matrix[0];
  const m01 = matrix[1];
  const m02 = matrix[2];
  const m03 = matrix[3];

  const m10 = matrix[4];
  const m11 = matrix[5];
  const m12 = matrix[6];
  const m13 = matrix[7];

  const m20 = matrix[8];
  const m21 = matrix[9];
  const m22 = matrix[10];
  const m23 = matrix[11];

  const m30 = matrix[12];
  const m31 = matrix[13];
  const m32 = matrix[14];
  const m33 = matrix[15];

  return (
    m03 * m12 * m21 * m30 -
    m02 * m13 * m21 * m30 -
    m03 * m11 * m22 * m30 +
    m01 * m13 * m22 * m30 +
    m02 * m11 * m23 * m30 -
    m01 * m12 * m23 * m30 -
    m03 * m12 * m20 * m31 +
    m02 * m13 * m20 * m31 +
    m03 * m10 * m22 * m31 -
    m00 * m13 * m22 * m31 -
    m02 * m10 * m23 * m31 +
    m00 * m12 * m23 * m31 +
    m03 * m11 * m20 * m32 -
    m01 * m13 * m20 * m32 -
    m03 * m10 * m21 * m32 +
    m00 * m13 * m21 * m32 +
    m01 * m10 * m23 * m32 -
    m00 * m11 * m23 * m32 -
    m02 * m11 * m20 * m33 +
    m01 * m12 * m20 * m33 +
    m02 * m10 * m21 * m33 -
    m00 * m12 * m21 * m33 -
    m01 * m10 * m22 * m33 +
    m00 * m11 * m22 * m33
  );
}

/**
 * Inverse of a matrix. Multiplying by the inverse is used in matrix math
 * instead of division.
 *
 * Formula from:
 * http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
 */
export function inverse(matrix: Matrix3D): Matrix3D {
  'worklet';
  const det = determinant(matrix);
  if (!det) {
    return matrix;
  }
  const m00 = matrix[0];
  const m01 = matrix[1];
  const m02 = matrix[2];
  const m03 = matrix[3];

  const m10 = matrix[4];
  const m11 = matrix[5];
  const m12 = matrix[6];
  const m13 = matrix[7];

  const m20 = matrix[8];
  const m21 = matrix[9];
  const m22 = matrix[10];
  const m23 = matrix[11];

  const m30 = matrix[12];
  const m31 = matrix[13];
  const m32 = matrix[14];
  const m33 = matrix[15];
  return [
    (m12 * m23 * m31 -
      m13 * m22 * m31 +
      m13 * m21 * m32 -
      m11 * m23 * m32 -
      m12 * m21 * m33 +
      m11 * m22 * m33) /
      det,
    (m03 * m22 * m31 -
      m02 * m23 * m31 -
      m03 * m21 * m32 +
      m01 * m23 * m32 +
      m02 * m21 * m33 -
      m01 * m22 * m33) /
      det,
    (m02 * m13 * m31 -
      m03 * m12 * m31 +
      m03 * m11 * m32 -
      m01 * m13 * m32 -
      m02 * m11 * m33 +
      m01 * m12 * m33) /
      det,
    (m03 * m12 * m21 -
      m02 * m13 * m21 -
      m03 * m11 * m22 +
      m01 * m13 * m22 +
      m02 * m11 * m23 -
      m01 * m12 * m23) /
      det,
    (m13 * m22 * m30 -
      m12 * m23 * m30 -
      m13 * m20 * m32 +
      m10 * m23 * m32 +
      m12 * m20 * m33 -
      m10 * m22 * m33) /
      det,
    (m02 * m23 * m30 -
      m03 * m22 * m30 +
      m03 * m20 * m32 -
      m00 * m23 * m32 -
      m02 * m20 * m33 +
      m00 * m22 * m33) /
      det,
    (m03 * m12 * m30 -
      m02 * m13 * m30 -
      m03 * m10 * m32 +
      m00 * m13 * m32 +
      m02 * m10 * m33 -
      m00 * m12 * m33) /
      det,
    (m02 * m13 * m20 -
      m03 * m12 * m20 +
      m03 * m10 * m22 -
      m00 * m13 * m22 -
      m02 * m10 * m23 +
      m00 * m12 * m23) /
      det,
    (m11 * m23 * m30 -
      m13 * m21 * m30 +
      m13 * m20 * m31 -
      m10 * m23 * m31 -
      m11 * m20 * m33 +
      m10 * m21 * m33) /
      det,
    (m03 * m21 * m30 -
      m01 * m23 * m30 -
      m03 * m20 * m31 +
      m00 * m23 * m31 +
      m01 * m20 * m33 -
      m00 * m21 * m33) /
      det,
    (m01 * m13 * m30 -
      m03 * m11 * m30 +
      m03 * m10 * m31 -
      m00 * m13 * m31 -
      m01 * m10 * m33 +
      m00 * m11 * m33) /
      det,
    (m03 * m11 * m20 -
      m01 * m13 * m20 -
      m03 * m10 * m21 +
      m00 * m13 * m21 +
      m01 * m10 * m23 -
      m00 * m11 * m23) /
      det,
    (m12 * m21 * m30 -
      m11 * m22 * m30 -
      m12 * m20 * m31 +
      m10 * m22 * m31 +
      m11 * m20 * m32 -
      m10 * m21 * m32) /
      det,
    (m01 * m22 * m30 -
      m02 * m21 * m30 +
      m02 * m20 * m31 -
      m00 * m22 * m31 -
      m01 * m20 * m32 +
      m00 * m21 * m32) /
      det,
    (m02 * m11 * m30 -
      m01 * m12 * m30 -
      m02 * m10 * m31 +
      m00 * m12 * m31 +
      m01 * m10 * m32 -
      m00 * m11 * m32) /
      det,
    (m01 * m12 * m20 -
      m02 * m11 * m20 +
      m02 * m10 * m21 -
      m00 * m12 * m21 -
      m01 * m10 * m22 +
      m00 * m11 * m22) /
      det,
  ];
}

/**
 * Turns columns into rows and rows into columns.
 */
export function transpose(m: Matrix3D): Matrix3D {
  'worklet';
  return [
    m[0],
    m[4],
    m[8],
    m[12],
    m[1],
    m[5],
    m[9],
    m[13],
    m[2],
    m[6],
    m[10],
    m[14],
    m[3],
    m[7],
    m[11],
    m[15],
  ];
}

/**
 * Based on: http://tog.acm.org/resources/GraphicsGems/gemsii/unmatrix.c
 */
export function multiplyVectorByMatrix(v: Vector3D, m: Matrix3D): Vector3D {
  'worklet';
  const vx = v[0];
  const vy = v[1];
  const vz = v[2];
  const vw = v[3];
  return [
    vx * m[0] + vy * m[4] + vz * m[8] + vw * m[12],
    vx * m[1] + vy * m[5] + vz * m[9] + vw * m[13],
    vx * m[2] + vy * m[6] + vz * m[10] + vw * m[14],
    vx * m[3] + vy * m[7] + vz * m[11] + vw * m[15],
  ];
}

/**
 * From: https://code.google.com/p/webgl-mjs/source/browse/mjs.js
 */
export function v3Length(a: number[]): number {
  'worklet';
  return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
}

/**
 * Based on: https://code.google.com/p/webgl-mjs/source/browse/mjs.js
 */
export function v3Normalize(vector: number[], len: number): number[] {
  'worklet';
  const im = 1 / (len || v3Length(vector));
  return [vector[0] * im, vector[1] * im, vector[2] * im];
}

/**
 * The dot product of a and b, two 3-element vectors.
 * From: https://code.google.com/p/webgl-mjs/source/browse/mjs.js
 */
export function v3Dot(a: number[], b: number[]) {
  'worklet';
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

/**
 * From:
 * http://www.opensource.apple.com/source/WebCore/WebCore-514/platform/graphics/transforms/TransformationMatrix.cpp
 */
export function v3Combine(
  a: Array<number>,
  b: Array<number>,
  aScale: number,
  bScale: number,
): Array<number> {
  'worklet';
  return [
    aScale * a[0] + bScale * b[0],
    aScale * a[1] + bScale * b[1],
    aScale * a[2] + bScale * b[2],
  ];
}

/**
 * From:
 * http://www.opensource.apple.com/source/WebCore/WebCore-514/platform/graphics/transforms/TransformationMatrix.cpp
 */
export function v3Cross(a: Array<number>, b: Array<number>): Array<number> {
  'worklet';
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

/**
 * Based on:
 * http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToEuler/
 * and:
 * http://quat.zachbennett.com/
 *
 * Note that this rounds degrees to the thousandth of a degree, due to
 * floating point errors in the creation of the quaternion.
 *
 * Also note that this expects the qw value to be last, not first.
 *
 * Also, when researching this, remember that:
 * yaw   === heading            === z-axis
 * pitch === elevation/attitude === y-axis
 * roll  === bank               === x-axis
 */
export function quaternionToDegreesXYZ(
  q: Array<number>,
  _matrix: number[][],
  _row: any,
): Array<number> {
  'worklet';
  const qx = q[0];
  const qy = q[1];
  const qz = q[2];
  const qw = q[3];
  const qw2 = qw * qw;
  const qx2 = qx * qx;
  const qy2 = qy * qy;
  const qz2 = qz * qz;
  const test = qx * qy + qz * qw;
  const unit = qw2 + qx2 + qy2 + qz2;
  const conv = 180 / Math.PI;

  if (test > 0.49999 * unit) {
    return [0, 2 * Math.atan2(qx, qw) * conv, 90];
  }
  if (test < -0.49999 * unit) {
    return [0, -2 * Math.atan2(qx, qw) * conv, -90];
  }

  return [
    roundTo3Places(
      Math.atan2(2 * qx * qw - 2 * qy * qz, 1 - 2 * qx2 - 2 * qz2) * conv,
    ),
    roundTo3Places(
      Math.atan2(2 * qy * qw - 2 * qx * qz, 1 - 2 * qy2 - 2 * qz2) * conv,
    ),
    roundTo3Places(Math.asin(2 * qx * qy + 2 * qz * qw) * conv),
  ];
}

/**
 * Based on:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
 */
export function roundTo3Places(n: number): number {
  'worklet';
  const arr = n.toString().split('e');
  return Math.round(Number(arr[0] + 'e' + (arr[1] ? +arr[1] - 3 : 3))) * 0.001;
}

/**
 * Decompose a matrix into separate transform values, for use on platforms
 * where applying a precomposed matrix is not possible, and transforms are
 * applied in an inflexible ordering (e.g. Android).
 *
 * Implementation based on
 * http://www.w3.org/TR/css3-transforms/#decomposing-a-2d-matrix
 * http://www.w3.org/TR/css3-transforms/#decomposing-a-3d-matrix
 * which was based on
 * http://tog.acm.org/resources/GraphicsGems/gemsii/unmatrix.c
 */
export function decomposeMatrix(transformMatrix: Matrix3D) {
  'worklet';
  // output values
  let perspective: number[] = [];
  const quaternion: number[] = [];
  const scale: number[] = [];
  const skew: number[] = [];
  const translation: number[] = [];

  // create normalized, 2d array matrix
  // and normalized 1d array perspectiveMatrix with redefined 4th column
  if (!transformMatrix[15]) {
    return;
  }
  const matrix: number[][] = [];
  const perspectiveMatrix: Matrix3D = [] as any;
  for (let i = 0; i < 4; i++) {
    matrix.push([]);
    for (let j = 0; j < 4; j++) {
      const value = transformMatrix[i * 4 + j] / transformMatrix[15];
      matrix[i].push(value);
      perspectiveMatrix.push(j === 3 ? 0 : value);
    }
  }
  perspectiveMatrix[15] = 1;

  // test for singularity of upper 3x3 part of the perspective matrix
  if (!determinant(perspectiveMatrix)) {
    return;
  }

  // isolate perspective
  if (matrix[0][3] !== 0 || matrix[1][3] !== 0 || matrix[2][3] !== 0) {
    // rightHandSide is the right hand side of the equation.
    // rightHandSide is a vector, or point in 3d space relative to the origin.
    const rightHandSide: Vector3D = [
      matrix[0][3],
      matrix[1][3],
      matrix[2][3],
      matrix[3][3],
    ];

    // Solve the equation by inverting perspectiveMatrix and multiplying
    // rightHandSide by the inverse.
    const inversePerspectiveMatrix = inverse(perspectiveMatrix);
    const transposedInversePerspectiveMatrix = transpose(
      inversePerspectiveMatrix,
    );
    perspective = multiplyVectorByMatrix(
      rightHandSide,
      transposedInversePerspectiveMatrix,
    );
  } else {
    // no perspective
    perspective[0] = perspective[1] = perspective[2] = 0;
    perspective[3] = 1;
  }

  // translation is simple
  for (let i = 0; i < 3; i++) {
    translation[i] = matrix[3][i];
  }

  // Now get scale and shear.
  // 'row' is a 3 element array of 3 component vectors
  const row = [];
  for (let i = 0; i < 3; i++) {
    row[i] = [matrix[i][0], matrix[i][1], matrix[i][2]];
  }

  // Compute X scale factor and normalize first row.
  scale[0] = v3Length(row[0]);
  row[0] = v3Normalize(row[0], scale[0]);

  // Compute XY shear factor and make 2nd row orthogonal to 1st.
  skew[0] = v3Dot(row[0], row[1]);
  row[1] = v3Combine(row[1], row[0], 1.0, -skew[0]);

  // Now, compute Y scale and normalize 2nd row.
  scale[1] = v3Length(row[1]);
  row[1] = v3Normalize(row[1], scale[1]);
  skew[0] /= scale[1];

  // Compute XZ and YZ shears, orthogonalize 3rd row
  skew[1] = v3Dot(row[0], row[2]);
  row[2] = v3Combine(row[2], row[0], 1.0, -skew[1]);
  skew[2] = v3Dot(row[1], row[2]);
  row[2] = v3Combine(row[2], row[1], 1.0, -skew[2]);

  // Next, get Z scale and normalize 3rd row.
  scale[2] = v3Length(row[2]);
  row[2] = v3Normalize(row[2], scale[2]);
  skew[1] /= scale[2];
  skew[2] /= scale[2];

  // At this point, the matrix (in rows) is orthonormal.
  // Check for a coordinate system flip.  If the determinant
  // is -1, then negate the matrix and the scaling factors.
  const pdum3 = v3Cross(row[1], row[2]);
  if (v3Dot(row[0], pdum3) < 0) {
    for (let i = 0; i < 3; i++) {
      scale[i] *= -1;
      row[i][0] *= -1;
      row[i][1] *= -1;
      row[i][2] *= -1;
    }
  }

  // Now, get the rotations out
  quaternion[0] =
    0.5 * Math.sqrt(Math.max(1 + row[0][0] - row[1][1] - row[2][2], 0));
  quaternion[1] =
    0.5 * Math.sqrt(Math.max(1 - row[0][0] + row[1][1] - row[2][2], 0));
  quaternion[2] =
    0.5 * Math.sqrt(Math.max(1 - row[0][0] - row[1][1] + row[2][2], 0));
  quaternion[3] =
    0.5 * Math.sqrt(Math.max(1 + row[0][0] + row[1][1] + row[2][2], 0));

  if (row[2][1] > row[1][2]) {
    quaternion[0] = -quaternion[0];
  }
  if (row[0][2] > row[2][0]) {
    quaternion[1] = -quaternion[1];
  }
  if (row[1][0] > row[0][1]) {
    quaternion[2] = -quaternion[2];
  }

  // correct for occasional, weird Euler synonyms for 2d rotation
  let rotationDegrees: number[] = [];
  if (
    quaternion[0] < 0.001 &&
    quaternion[0] >= 0 &&
    quaternion[1] < 0.001 &&
    quaternion[1] >= 0
  ) {
    // this is a 2d rotation on the z-axis
    rotationDegrees = [
      0,
      0,
      roundTo3Places((Math.atan2(row[0][1], row[0][0]) * 180) / Math.PI),
    ];
  } else {
    rotationDegrees = quaternionToDegreesXYZ(quaternion, matrix, row);
  }

  // expose both base data and convenience names
  return {
    rotationDegrees,
    perspective,
    quaternion,
    scale,
    skew,
    translation,

    rotate: rotationDegrees[2],
    rotateX: rotationDegrees[0],
    rotateY: rotationDegrees[1],
    scaleX: scale[0],
    scaleY: scale[1],
    translateX: translation[0],
    translateY: translation[1],
  };
}
