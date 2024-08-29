class Matrix4x4 {
    #prefixMult;
    #data;

    static identity = new Matrix4x4();
    static zero = new Matrix4x4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);


    /**
     *  Calculates the prefix sum of the absolute value of each column and row of the matrix.
     *  The result is stored in the #prefixMult property.
     */
    #calcPrefixMult() {

        const getAbsValue = (i) => Math.abs(this.#data[i]);

        this.#prefixMult = [
            getAbsValue( 0) + getAbsValue( 1) + getAbsValue( 2) + getAbsValue( 3),
            getAbsValue( 4) + getAbsValue( 5) + getAbsValue( 6) + getAbsValue( 7),
            getAbsValue( 8) + getAbsValue( 9) + getAbsValue(10) + getAbsValue(11),
            getAbsValue(12) + getAbsValue(13) + getAbsValue(14) + getAbsValue(15),
            
            
            getAbsValue( 0) + getAbsValue( 4) + getAbsValue( 8) + getAbsValue(12),
            getAbsValue( 1) + getAbsValue( 5) + getAbsValue( 9) + getAbsValue(13),
            getAbsValue( 2) + getAbsValue( 6) + getAbsValue(10) + getAbsValue(14),
            getAbsValue( 3) + getAbsValue( 7) + getAbsValue(11) + getAbsValue(15),
        ]
    }

    /**
     *  Creates a new Matrix4x4.
     */
    constructor(
        m11=1, m12=0, m13=0, m14=0,
        m21=0, m22=1, m23=0, m24=0,
        m31=0, m32=0, m33=1, m34=0,
        m41=0, m42=0, m43=0, m44=1
    ) {
        this.#data = new Float32Array([
            m11, m12, m13, m14,
            m21, m22, m23, m24,
            m31, m32, m33, m34,
            m41, m42, m43, m44,
        ]);
        this.#calcPrefixMult();
    }
    
    /**
     *  Returns true if the matrix is nullable, i.e., if its prefix sum has any 0.
     *  This is a quick way to check if the matrix is valid or not.
     *  @return {boolean} True if the matrix is nullable, false otherwise.
     */
    nullable() {
        return this.#prefixMult.includes(0);
    }


    /**
     * Returns the underlying Float32Array of this matrix.
     * @return {Float32Array} The underlying array.
     */
    getData() {
        return this.#data;
    }


    /**
     * Returns a new Matrix4x4 representing a translation in 3D space.
     *
     * @param {number} x - The translation along the X-axis.
     * @param {number} y - The translation along the Y-axis.
     * @param {number} z - The translation along the Z-axis.
     * @return {Matrix4x4} A new Matrix4x4 representing the translation.
     */
    static translation(x, y, z) {
        return new Matrix4x4(
            1, 0, 0, x,
            0, 1, 0, y,
            0, 0, 1, z,
            0, 0, 0, 1
        );
    }

    /**
     * Returns a new Matrix4x4 representing a rotation around the X-axis.
     *
     * @param {number} angle - The angle of rotation in radians.
     * @return {Matrix4x4} A new Matrix4x4 representing the rotation.
     */
    static rotationX(angle) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        return new Matrix4x4(
            1, 0,  0, 0,
            0, c, -s, 0,
            0, s,  c, 0,
            0, 0,  0, 1
        );
    }

    /**
     * Returns a new Matrix4x4 representing a rotation around the Y-axis.
     *
     * @param {number} angle - The angle of rotation in radians.
     * @return {Matrix4x4} A new Matrix4x4 representing the rotation.
     */
    static rotationY(angle) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);

        return new Matrix4x4(
             c, 0, s, 0,
             0, 1, 0, 0,
            -s, 0, c, 0,
             0, 0, 0, 1
        );
    }

    /**
     * Returns a new Matrix4x4 representing a rotation around the Z-axis.
     *
     * @param {number} angle - The angle of rotation in radians.
     * @return {Matrix4x4} A new Matrix4x4 representing the rotation.
     */
    static rotationZ(angle) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);

        return new Matrix4x4(
            c, -s, 0, 0, 
            s,  c, 0, 0,
            0,  0, 1, 0,
            0,  0, 0, 1
        );
    }

    /**
     * Returns a new Matrix4x4 representing a scaling transformation.
     *
     * @param {number} x - The scale factor along the X-axis.
     * @param {number} y - The scale factor along the Y-axis.
     * @param {number} z - The scale factor along the Z-axis.
     * @return {Matrix4x4} A new Matrix4x4 representing the scaling transformation.
     */
    static scale(x, y, z) {
        return new Matrix4x4(
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1
        );
    }

    /**
     * Returns a new Matrix4x4 representing a perspective transformation.
     *
     * @param {number} fovy - The angle of the vertical field of view in radians.
     * @param {number} aspect - The aspect ratio of the viewport.
     * @param {number} near - The distance to the near clipping plane.
     * @param {number} far - The distance to the far clipping plane.
     * @return {Matrix4x4} A new Matrix4x4 representing the perspective transformation.
     */
    static perspective(fovy, aspect, near, far) {
        const f = 1.0 / Math.tan(fovy / 2.0);
        const range = near - far;

        return new Matrix4x4(
            f / aspect, 0,                    0,                      0,
                     0, f,                    0,                      0,
                     0, 0, (far + near) / range, 2 * far * near / range,
                     0, 0,                   -1,                      0
        );
    }





    /**
     * Adds another matrix to this matrix.
     *
     * @param {Matrix4x4} other - The matrix to add to this matrix.
     * @return {Matrix4x4} A new matrix that is the sum of this matrix and the other matrix.
     */
    add(other) {
        if (!(other instanceof Matrix4x4))
            throw new Error("matrix4x4.add() only works with other matrix4x4");

        if (Matrix4x4.zero === other) return this;

        if (Matrix4x4.zero === this) return other;

        const data = new Float32Array(16);
        for (let i = 0; i < 16; i++) {
            data[i] = this.#data[i] + other.data[i];
        }

        this.#calcPrefixMult();

        return new Matrix4x4(...data);
    }


    multiply(other) {
        if (!(other instanceof Matrix4x4))
            throw new Error(
                "matrix4x4.multiply() only works with other matrix4x4"
            );

        if (Matrix4x4.zero === other || Matrix4x4.zero === this) return this;

        if (Matrix4x4.identity === other) return this;

        if (Matrix4x4.identity === this) return other;

        const data = new Float32Array(16);
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let sum = 0;
                for (let k = 0; k < 4; k++) {
                    sum += this.#data[i * 4 + k] * other.#data[k * 4 + j];
                }
                data[i * 4 + j] = sum;
            }
        }

        this.#calcPrefixMult();

        return new Matrix4x4(...data);
    }
    

    /**
     * Applies all the matrices in the given array to this matrix, by multiplying them in order.
     *
     * @param {Matrix4x4[]} others - The array of matrices to apply.
     * @return {Matrix4x4} A new Matrix4x4 that is the result of applying all the matrices in the given array to this matrix.
     */
    static applyAll(...transformations){
        if (!(transformations instanceof Array))
            throw new Error(
                "matrix4x4.applyAll() only works with array of matrix4x4"
            );

        if (transformations.length === 0) return Matrix4x4.identity;

        if (transformations.length === 1) transformations[0];

        let result = new Matrix4x4;
        for (let i = 0; i < transformations.length; i++)
        {
            if(transformations[i].nullable()) return Matrix4x4.zero;
            if (transformations[i] === Matrix4x4.identity) continue;

            result = result.multiply(transformations[i]);
        }
        return result;
    }

    
    /**
     * Applies all the matrices in the given array to this matrix, by multiplying them in order.
     *
     * @param {Matrix4x4[]} others - The array of matrices to apply.
     * @return {Matrix4x4} A new Matrix4x4 that is the result of applying all the matrices in the given array to this matrix.
     */
    applyAll(...others) {
        return Matrix4x4.applyAll(this, ...others);
    }

    
    /**
     * Returns a string that represents the matrix in a 4x4 form, with each
     * element right-aligned in a field of 8 characters.
     * @return {string}
     */
    toString() {
        const getData = (i) => this.#data[i].toFixed(2).padStart(8, " ");


        return  `${getData( 0)}, ${getData( 1)}, ${getData( 2)}, ${getData( 3)},\n` +
                `${getData( 4)}, ${getData( 5)}, ${getData( 6)}, ${getData( 7)},\n` +
                `${getData( 8)}, ${getData( 9)}, ${getData(10)}, ${getData(11)},\n` +
                `${getData(12)}, ${getData(13)}, ${getData(14)}, ${getData(15)}\n`;
    }
}

export { Matrix4x4 };