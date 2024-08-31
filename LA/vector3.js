import { Matrix4x4 } from "./matrix4x4.js";

class Vector3 {
    x;
    y;
    z;

    static zero = new Vector3(0, 0, 0);
    static one = new Vector3(1, 1, 1);

    static baseI = new Vector3(1, 0, 0);
    static baseJ = new Vector3(0, 1, 0);
    static baseK = new Vector3(0, 0, 1);

    constructor(x=0, y=0, z=0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }


    /**
     * Returns an array with the values of the vector in the order [x, y, z].
     * @return {number[]} The values of the vector.
     */
    getData() {
        return [this.x, this.y, this.z];
    }


    /**
     * Returns a new vector that is the sum of the two given vectors.
     *
     * @param {Vector3} v1 - The first vector.
     * @param {Vector3} v2 - The second vector.
     * @return {Vector3} A new vector that is the sum of the two given vectors.
     */
    static add(v1, v2) {
        return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }

    /**
     * Returns a new vector that is the sum of this vector and the given vector.
     * @param {Vector3} v - The vector to add to this one.
     * @return {Vector3} A new vector that is the sum of this vector and the given vector.
     */
    add(v) {
        return Vector3.add(this, v);
    }


    /**
     * Returns a new vector that is the result of multiplying the given vector by the given scalar.
     *
     * @param {number} scalar - The scalar to multiply the given vector by.
     * @param {Vector3} v2 - The vector to be multiplied.
     * @return {Vector3} A new vector that is the result of multiplying the given vector by the given scalar.
     */
    static mult(scalar, v2) {
        return new Vector3(scalar * v2.x, scalar * v2.y, scalar * v2.z);
    }

    /**
     * Returns a new vector that is the result of multiplying this vector by the given scalar.
     *
     * @param {number} scalar - The scalar to multiply this vector by.
     * @return {Vector3} A new vector that is the result of multiplying this vector by the given scalar.
     */
    mult(scalar) {
        return Vector3.mult(scalar, this);
    }


    /**
     * Computes the dot product of two vectors.
     *
     * @param {Vector3} v1 - The first vector.
     * @param {Vector3} v2 - The second vector.
     * @return {number} The dot product of the two given vectors.
     */
    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }

    /**
     * Computes the dot product of this vector and the given vector.
     * @param {Vector3} v - The vector to compute the dot product with.
     * @return {number} The dot product of this vector and the given vector.
     */
    dot(v) {
        return Vector3.dot(this, v);
    }

    /**
     * Computes the cross product of two vectors.
     *
     * @param {Vector3} v1 - The first vector.
     * @param {Vector3} v2 - The second vector.
     * @return {Vector3} A new vector that is the cross product of the two given vectors.
     */
    static cross(v1, v2) {
        return new Vector3(
            v1.y * v2.z - v1.z * v2.y,
            v1.z * v2.x - v1.x * v2.z,
            v1.x * v2.y - v1.y * v2.x
        );
    }

    /**
     * Computes the cross product of this vector and the given vector.
     * @param {Vector3} v - The vector to compute the cross product with.
     * @return {Vector3} A new vector that is the cross product of this vector and the given vector.
     */
    cross(v) {
        return Vector3.cross(this, v);
    }


    /**
     * Applies a 4x4 matrix to a vector.
     *
     * @param {Vector3} v - The vector to apply the matrix to.
     * @param {Matrix4x4} m - The 4x4 matrix to apply to the vector.
     * @return {Vector3} A new vector that is the result of applying the matrix to the vector.
     */
    static applyMatrix(v, m) {
        m = m.getData();
        return new Vector3(
            v.x * m[0] + v.y * m[4] + v.z * m[ 8] + m[12],
            v.x * m[1] + v.y * m[5] + v.z * m[ 9] + m[13],
            v.x * m[2] + v.y * m[6] + v.z * m[10] + m[14]
        );
    }

    magnitude() {
        return Math.hypot(this.x, this.y, this.z);
    }

    normalized() {
        const mag = this.magnitude();

        return this.mult(1 / mag);
    }

    /**
     * Applies a 4x4 matrix to this vector.
     *
     * @param {Matrix4x4} m - The 4x4 matrix to apply to this vector.
     * @return {Vector3} A new vector that is the result of applying the matrix to this vector.
     */
    applyMatrix(m) {
        return Vector3.applyMatrix(this, m);
    }

    toArray() {
        return this.getData();
    }

    toString() {
        return `(${this.x}, ${this.y}, ${this.z})`;
    }
}

export { Vector3 };