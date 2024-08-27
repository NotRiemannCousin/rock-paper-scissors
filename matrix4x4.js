class Matrix4x4 {
    constructor(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        this.data = new Float32Array([m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44]);
    }

    static zero() {
        return new Matrix4x4(
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
        );
    }

    static identity() {
        return new Matrix4x4(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
    }

    static translation(x, y, z) {
        return new Matrix4x4(
            1, 0, 0, x,
            0, 1, 0, y,
            0, 0, 1, z,
            0, 0, 0, 1
        );
    }

    static rotationX(angle) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        return new Matrix4x4(
            1, 0, 0, 0,
            0, c, -s, 0,
            0, s, c, 0,
            0, 0, 0, 1
        );
    }

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

    static rotationZ(angle) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        return new Matrix4x4(
            c, -s, 0, 0,
            s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
    }

    add(other) {
        if (!(other instanceof Matrix4x4))
            throw new Error("matrix4x4.add() only works with other matrix4x4");

        if (Matrix4x4.zero() === other)
            return this;

        if (Matrix4x4.zero() === this) 
            return other;

        const data = new Float32Array(16);
        for (let i = 0; i < 16; i++) {
            data[i] = this.data[i] + other.data[i];
        }
        return new Matrix4x4(...data);
    }

    "+"(other) {
        return this.add(other);
    }

    multiply(other) {
        if (!(other instanceof Matrix4x4))
            throw new Error("matrix4x4.multiply() only works with other matrix4x4");
        
        if (Matrix4x4.identity() === other)
            return this;

        if (Matrix4x4.identity() === this)
            return other;

        const data = new Float32Array(16);
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let sum = 0;
                for (let k = 0; k < 4; k++) {
                    sum += this.data[i * 4 + k] * other.data[k * 4 + j];
                }
                data[i * 4 + j] = sum;
            }
        }
        return new Matrix4x4(...data);
    }

    "*"(other) {
        return this.multiply(other);
    }
}

export { Matrix4x4 as Matrix };