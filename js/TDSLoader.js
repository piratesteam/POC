THREE.TDSLoader=function(e){this.manager=void 0!==e?e:THREE.DefaultLoadingManager,this.debug=!1,this.group=null,this.position=0,this.materials=[],this.meshes=[]},THREE.TDSLoader.prototype={constructor:THREE.TDSLoader,crossOrigin:"anonymous",load:function(e,t,s,i){var r=this,a=void 0!==this.path?this.path:THREE.LoaderUtils.extractUrlBase(e),n=new THREE.FileLoader(this.manager);n.setPath(this.path),n.setResponseType("arraybuffer"),n.load(e,function(e){t(r.parse(e,a))},s,i)},parse:function(e,t){this.group=new THREE.Group,this.position=0,this.materials=[],this.meshes=[],this.readFile(e,t);for(var s=0;s<this.meshes.length;s++)this.group.add(this.meshes[s]);return this.group},readFile:function(e,t){var s=new DataView(e),i=this.readChunk(s);if(i.id===MLIBMAGIC||i.id===CMAGIC||i.id===M3DMAGIC)for(var r=this.nextChunk(s,i);0!==r;){if(r===M3D_VERSION){var a=this.readDWord(s);this.debugMessage("3DS file version: "+a)}else r===MDATA?(this.resetPosition(s),this.readMeshData(s,t)):this.debugMessage("Unknown main chunk: "+r.toString(16));r=this.nextChunk(s,i)}this.debugMessage("Parsed "+this.meshes.length+" meshes")},readMeshData:function(e,t){for(var s=this.readChunk(e),i=this.nextChunk(e,s);0!==i;){if(i===MESH_VERSION){var r=+this.readDWord(e);this.debugMessage("Mesh Version: "+r)}else if(i===MASTER_SCALE){var a=this.readFloat(e);this.debugMessage("Master scale: "+a),this.group.scale.set(a,a,a)}else i===NAMED_OBJECT?(this.debugMessage("Named Object"),this.resetPosition(e),this.readNamedObject(e)):i===MAT_ENTRY?(this.debugMessage("Material"),this.resetPosition(e),this.readMaterialEntry(e,t)):this.debugMessage("Unknown MDATA chunk: "+i.toString(16));i=this.nextChunk(e,s)}},readNamedObject:function(e){var t=this.readChunk(e),s=this.readString(e,64);t.cur=this.position;for(var i=this.nextChunk(e,t);0!==i;){if(i===N_TRI_OBJECT){this.resetPosition(e);var r=this.readMesh(e);r.name=s,this.meshes.push(r)}else this.debugMessage("Unknown named object chunk: "+i.toString(16));i=this.nextChunk(e,t)}this.endChunk(t)},readMaterialEntry:function(e,t){for(var s=this.readChunk(e),i=this.nextChunk(e,s),r=new THREE.MeshPhongMaterial;0!==i;){if(i===MAT_NAME)r.name=this.readString(e,64),this.debugMessage("   Name: "+r.name);else if(i===MAT_WIRE)this.debugMessage("   Wireframe"),r.wireframe=!0;else if(i===MAT_WIRE_SIZE){var a=this.readByte(e);r.wireframeLinewidth=a,this.debugMessage("   Wireframe Thickness: "+a)}else if(i===MAT_TWO_SIDE)r.side=THREE.DoubleSide,this.debugMessage("   DoubleSided");else if(i===MAT_ADDITIVE)this.debugMessage("   Additive Blending"),r.blending=THREE.AdditiveBlending;else if(i===MAT_DIFFUSE)this.debugMessage("   Diffuse Color"),r.color=this.readColor(e);else if(i===MAT_SPECULAR)this.debugMessage("   Specular Color"),r.specular=this.readColor(e);else if(i===MAT_AMBIENT)this.debugMessage("   Ambient color"),r.color=this.readColor(e);else if(i===MAT_SHININESS){var n=this.readWord(e);r.shininess=n,this.debugMessage("   Shininess : "+n)}else i===MAT_TEXMAP?(this.debugMessage("   ColorMap"),this.resetPosition(e),r.map=this.readMap(e,t)):i===MAT_BUMPMAP?(this.debugMessage("   BumpMap"),this.resetPosition(e),r.bumpMap=this.readMap(e,t)):i===MAT_OPACMAP?(this.debugMessage("   OpacityMap"),this.resetPosition(e),r.alphaMap=this.readMap(e,t)):i===MAT_SPECMAP?(this.debugMessage("   SpecularMap"),this.resetPosition(e),r.specularMap=this.readMap(e,t)):this.debugMessage("   Unknown material chunk: "+i.toString(16));i=this.nextChunk(e,s)}this.endChunk(s),this.materials[r.name]=r},readMesh:function(e){var t=this.readChunk(e),s=this.nextChunk(e,t),i=new THREE.BufferGeometry,r=[],a=new THREE.MeshPhongMaterial,n=new THREE.Mesh(i,a);for(n.name="mesh";0!==s;){if(s===POINT_ARRAY){var h=this.readWord(e);this.debugMessage("   Vertex: "+h);for(var o=[],d=0;d<h;d++)o.push(this.readFloat(e)),o.push(this.readFloat(e)),o.push(this.readFloat(e));i.addAttribute("position",new THREE.Float32BufferAttribute(o,3))}else if(s===FACE_ARRAY)this.resetPosition(e),this.readFaceArray(e,n);else if(s===TEX_VERTS){var u=this.readWord(e);this.debugMessage("   UV: "+u);for(r=[],d=0;d<u;d++)r.push(this.readFloat(e)),r.push(this.readFloat(e));i.addAttribute("uv",new THREE.Float32BufferAttribute(r,2))}else if(s===MESH_MATRIX){this.debugMessage("   Tranformation Matrix (TODO)");var M=[];for(d=0;d<12;d++)M[d]=this.readFloat(e);var g=new THREE.Matrix4;g.elements[0]=M[0],g.elements[1]=M[6],g.elements[2]=M[3],g.elements[3]=M[9],g.elements[4]=M[2],g.elements[5]=M[8],g.elements[6]=M[5],g.elements[7]=M[11],g.elements[8]=M[1],g.elements[9]=M[7],g.elements[10]=M[4],g.elements[11]=M[10],g.elements[12]=0,g.elements[13]=0,g.elements[14]=0,g.elements[15]=1,g.transpose();var l=new THREE.Matrix4;l.getInverse(g,!0),i.applyMatrix(l),g.decompose(n.position,n.quaternion,n.scale)}else this.debugMessage("   Unknown mesh chunk: "+s.toString(16));s=this.nextChunk(e,t)}return this.endChunk(t),i.computeVertexNormals(),n},readFaceArray:function(e,t){var s=this.readChunk(e),i=this.readWord(e);this.debugMessage("   Faces: "+i);for(var r=[],a=0;a<i;++a)r.push(this.readWord(e),this.readWord(e),this.readWord(e)),this.readWord(e);for(t.geometry.setIndex(r);this.position<s.end;){if((s=this.readChunk(e)).id===MSH_MAT_GROUP){this.debugMessage("      Material Group"),this.resetPosition(e);var n=this.readMaterialGroup(e),h=this.materials[n.name];void 0!==h&&""===(t.material=h).name&&(h.name=t.name)}else this.debugMessage("      Unknown face array chunk: "+s.toString(16));this.endChunk(s)}this.endChunk(s)},readMap:function(e,t){var s=this.readChunk(e),i=this.nextChunk(e,s),r={},a=new THREE.TextureLoader(this.manager);for(a.setPath(this.resourcePath||t).setCrossOrigin(this.crossOrigin);0!==i;){if(i===MAT_MAPNAME){var n=this.readString(e,128);r=a.load(n),this.debugMessage("      File: "+t+n)}else i===MAT_MAP_UOFFSET?(r.offset.x=this.readFloat(e),this.debugMessage("      OffsetX: "+r.offset.x)):i===MAT_MAP_VOFFSET?(r.offset.y=this.readFloat(e),this.debugMessage("      OffsetY: "+r.offset.y)):i===MAT_MAP_USCALE?(r.repeat.x=this.readFloat(e),this.debugMessage("      RepeatX: "+r.repeat.x)):i===MAT_MAP_VSCALE?(r.repeat.y=this.readFloat(e),this.debugMessage("      RepeatY: "+r.repeat.y)):this.debugMessage("      Unknown map chunk: "+i.toString(16));i=this.nextChunk(e,s)}return this.endChunk(s),r},readMaterialGroup:function(e){this.readChunk(e);var t=this.readString(e,64),s=this.readWord(e);this.debugMessage("         Name: "+t),this.debugMessage("         Faces: "+s);for(var i=[],r=0;r<s;++r)i.push(this.readWord(e));return{name:t,index:i}},readColor:function(e){var t=this.readChunk(e),s=new THREE.Color;if(t.id===COLOR_24||t.id===LIN_COLOR_24){var i=this.readByte(e),r=this.readByte(e),a=this.readByte(e);s.setRGB(i/255,r/255,a/255),this.debugMessage("      Color: "+s.r+", "+s.g+", "+s.b)}else if(t.id===COLOR_F||t.id===LIN_COLOR_F){i=this.readFloat(e),r=this.readFloat(e),a=this.readFloat(e);s.setRGB(i,r,a),this.debugMessage("      Color: "+s.r+", "+s.g+", "+s.b)}else this.debugMessage("      Unknown color chunk: "+t.toString(16));return this.endChunk(t),s},readChunk:function(e){var t={};return t.cur=this.position,t.id=this.readWord(e),t.size=this.readDWord(e),t.end=t.cur+t.size,t.cur+=6,t},endChunk:function(e){this.position=e.end},nextChunk:function(e,t){if(t.cur>=t.end)return 0;this.position=t.cur;try{var s=this.readChunk(e);return t.cur+=s.size,s.id}catch(e){return this.debugMessage("Unable to read chunk at "+this.position),0}},resetPosition:function(){this.position-=6},readByte:function(e){var t=e.getUint8(this.position,!0);return this.position+=1,t},readFloat:function(t){try{var e=t.getFloat32(this.position,!0);return this.position+=4,e}catch(e){this.debugMessage(e+" "+this.position+" "+t.byteLength)}},readInt:function(e){var t=e.getInt32(this.position,!0);return this.position+=4,t},readShort:function(e){var t=e.getInt16(this.position,!0);return this.position+=2,t},readDWord:function(e){var t=e.getUint32(this.position,!0);return this.position+=4,t},readWord:function(e){var t=e.getUint16(this.position,!0);return this.position+=2,t},readString:function(e,t){for(var s="",i=0;i<t;i++){var r=this.readByte(e);if(!r)break;s+=String.fromCharCode(r)}return s},setPath:function(e){return this.path=e,this},setResourcePath:function(e){return this.resourcePath=e,this},setCrossOrigin:function(e){return this.crossOrigin=e,this},debugMessage:function(e){this.debug&&console.log(e)}};var M3DMAGIC=19789,MLIBMAGIC=15786,CMAGIC=49725,M3D_VERSION=2,COLOR_F=16,COLOR_24=17,LIN_COLOR_24=18,LIN_COLOR_F=19,MDATA=15677,MESH_VERSION=15678,MASTER_SCALE=256,MAT_ENTRY=45055,MAT_NAME=40960,MAT_AMBIENT=40976,MAT_DIFFUSE=40992,MAT_SPECULAR=41008,MAT_SHININESS=41024,MAT_TWO_SIDE=41089,MAT_ADDITIVE=41091,MAT_WIRE=41093,MAT_WIRE_SIZE=41095,MAT_TEXMAP=41472,MAT_OPACMAP=41488,MAT_BUMPMAP=41520,MAT_SPECMAP=41476,MAT_MAPNAME=41728,MAT_MAP_USCALE=41812,MAT_MAP_VSCALE=41814,MAT_MAP_UOFFSET=41816,MAT_MAP_VOFFSET=41818,NAMED_OBJECT=16384,N_TRI_OBJECT=16640,POINT_ARRAY=16656,FACE_ARRAY=16672,MSH_MAT_GROUP=16688,TEX_VERTS=16704,MESH_MATRIX=16736;