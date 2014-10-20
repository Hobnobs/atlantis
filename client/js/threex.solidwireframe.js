//Copyright (c) 2013 Jerome Etienne, http://jetienne.com
//
//Permission is hereby granted, free of charge, to any person obtaining
//a copy of this software and associated documentation files (the
//"Software"), to deal in the Software without restriction, including
//without limitation the rights to use, copy, modify, merge, publish,
//distribute, sublicense, and/or sell copies of the Software, and to
//permit persons to whom the Software is furnished to do so, subject to
//the following conditions:
//
//The above copyright notice and this permission notice shall be
//included in all copies or substantial portions of the Software.
//
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
//EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
//MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
//NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
//LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
//OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
//WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//Slightly modified by Hobnob

var THREEx	= THREEx	|| {}

THREEx.SolidWireframeMaterial	= function(geometry, lineColor, faceColor){
    lineColor = (typeof lineColor === "undefined") ? new THREE.Color( 0xffffff ) : lineColor;
    faceColor = (typeof faceColor === "undefined") ? new THREE.Color( 0x222222 ) : faceColor;

	// wireframe using gl.TRIANGLES (interpreted as quads)

	var attributes	= {
		center: {
			type	: 'v4',
			boundTo	: 'faceVertices',
			value	: []
		}
	};
	var values	= attributes.center.value;

	setupAttributes( geometry, values );

	var shader	= THREEx.SolidWireframeMaterial.Shader
	shader.uniforms.faceColor.value = faceColor;
	shader.uniforms.lineColor.value = lineColor;
	var material	= new THREE.ShaderMaterial({
		uniforms	: THREE.UniformsUtils.clone(shader.uniforms),
		attributes	: attributes,
		vertexShader	: shader.vertexShader,
		fragmentShader	: shader.fragmentShader,
	});
	
	return material;

	function setupAttributes( geometry, values ) {
		for( var f = 0; f < geometry.faces.length; f ++ ) {
			var face = geometry.faces[ f ];
			if ( face instanceof THREE.Face3 ) {
				values[ f ] = [ new THREE.Vector4( 1, 0, 0, 0 ), new THREE.Vector4( 0, 1, 0, 0 ), new THREE.Vector4( 0, 0, 1, 0 ) ];
			} else {
				values[ f ] = [ new THREE.Vector4( 1, 0, 0, 1 ), new THREE.Vector4( 1, 1, 0, 1 ), new THREE.Vector4( 0, 1, 0, 1 ), new THREE.Vector4( 0, 0, 0, 1 ) ];
			}
		}
	}
}

THREEx.SolidWireframeMaterial.Shader = {
	uniforms: {
		"lineWidth"	: { type: "f", value: 2.0 },
		"faceColor"	: { type: "c", value: new THREE.Color( 0x222222 ) },
		"lineColor"	: { type: "c", value: new THREE.Color( 0xffffff ) },
	},
	vertexShader: [
		"attribute vec4 center;",
		"varying vec4 vCenter;",

		"void main() {",
			"vCenter = center;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}",
	].join('\n'),
 
	fragmentShader	: [
		"#extension GL_OES_standard_derivatives : enable",

		"varying vec4 vCenter;",
		// control parameter
		"uniform float lineWidth;",
                "uniform vec3 faceColor;",
                "uniform vec3 lineColor;",	

		"float edgeFactorTri() {",
			"vec3 d = fwidth( vCenter.xyz );",
			"vec3 a3 = smoothstep( vec3( 0.0 ), d * lineWidth, vCenter.xyz );",
			"return min( min( a3.x, a3.y ), a3.z );",
		"}",

		"float edgeFactorQuad1() {",
			"vec2 d = fwidth( vCenter.xy );",
			"vec2 a2 = smoothstep( vec2( 0.0 ), d * lineWidth, vCenter.xy );",
			"return min( a2.x, a2.y );",
		"}",

		"float edgeFactorQuad2() {",
			"vec2 d = fwidth( 1.0 - vCenter.xy );",
			"vec2 a2 = smoothstep( vec2( 0.0 ), d * lineWidth, 1.0 - vCenter.xy );",
			"return min( a2.x, a2.y );",
		"}",

		"void main() {",
			"if ( vCenter.w == 0.0 ) {",
				"gl_FragColor.rgb = mix( lineColor, faceColor, edgeFactorTri() );",
			"} else {",
				"gl_FragColor.rgb = mix( lineColor, faceColor, min( edgeFactorQuad1(), edgeFactorQuad2() ) );",

			"}",
			"gl_FragColor.a = 1.0;",
		"}",
	].join('\n')
};

