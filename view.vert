attribute vec3 Position;

uniform mat4 u_ModelView;
uniform mat4 u_Pesp;

void main(void) {
    gl_Position = u_Pesp * u_ModelView * vec4(Position, 1.0);
}