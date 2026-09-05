"""Map-based 1.5km-radius Pek Kio district. OSM geometry under ODbL 1.0.
Run Blender --background --python scripts/build_neighbourhood.py
Heights: mapped height; otherwise levels x3.2m; otherwise explicit category estimate.
Courtyards, roof shapes, terrain and facade detail are simplified. Units: 1m = .02 scene units.
"""
import bpy, math, json, os, random, re, gzip
from mathutils import Vector
from collections import defaultdict
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT=os.path.join(ROOT,'public','models'); DATA=os.path.join(ROOT,'public','data')
source=json.load(open(os.path.join(DATA,'map-source.json'),encoding='utf8'))
raw=os.path.join(DATA,'pekkio-osm.json')
elements=json.load(open(raw,encoding='utf8') if os.path.exists(raw) else gzip.open(raw+'.gz','rt',encoding='utf8'))['elements']
LAT,LON=source['center']['lat'],source['center']['lon']; R=1500.; S=.02
random.seed(6)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
def mat(n,c):
 m=bpy.data.materials.new(n);m.diffuse_color=(*c,1);m.use_nodes=True;bs=m.node_tree.nodes.get('Principled BSDF');bs.inputs['Base Color'].default_value=(*c,1);bs.inputs['Roughness'].default_value=.83;return m
materials={
 'ground':mat('Warm stone city base',(.81,.82,.70)), 'edge':mat('Ivory plinth',(.84,.80,.68)),
 'road':mat('Mapped streets',(.40,.48,.46)), 'path':mat('Walking paths',(.70,.73,.62)),
 'green':mat('Mapped parks and pitches',(.39,.62,.38)), 'water':mat('Mapped water',(.33,.62,.67)),
 'coral':mat('Pek Kio CC',(.94,.35,.22)), 'yellow':mat('Markets and landmarks',(.91,.68,.24)),
 'hospital':mat('Healthcare',(.53,.71,.74)), 'school':mat('Schools',(.56,.73,.53)),
 'retail':mat('Retail and shophouses',(.84,.63,.47)), 'roof':mat('Roof caps',(.89,.87,.78)),
 'line':mat('Distance rings',(.66,.73,.57)), 'ink':mat('Map lettering',(.18,.32,.27)),
 'white':mat('Wayfinding white',(.97,.95,.86)), 'windows':mat('Tower floor accents',(.51,.60,.61))}
for i,c in enumerate([(.73,.70,.75),(.81,.76,.68),(.65,.74,.69),(.73,.78,.78),(.80,.70,.63)]):materials['building'+str(i)]=mat('Neighbourhood pastel '+str(i),c)
batches=defaultdict(lambda:[[],[]])
def xy(p):return ((p['lon']-LON)*111320*math.cos(math.radians(LAT)),(p['lat']-LAT)*110574)
def signed(poly):return sum(poly[i][0]*poly[(i+1)%len(poly)][1]-poly[(i+1)%len(poly)][0]*poly[i][1] for i in range(len(poly)))/2
boundary=[(R*math.cos(i*2*math.pi/96),R*math.sin(i*2*math.pi/96)) for i in range(96)]
def clip(poly):
 # Convex clipping boundary. Fast path for footprints fully inside the 1.5km disc.
 if not poly:return []
 if all(x*x+y*y<(R-1)**2 for x,y in poly):return poly
 if all(x>R for x,y in poly) or all(x<-R for x,y in poly) or all(y>R for x,y in poly) or all(y<-R for x,y in poly):return []
 for i,a in enumerate(boundary):
  b=boundary[(i+1)%len(boundary)];old=poly;poly=[]
  if not old:break
  def side(p):return (b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0])
  last=old[-1];ls=side(last)
  for p in old:
   ps=side(p)
   if (ps>=0)!=(ls>=0):
    t=ls/(ls-ps);poly.append((last[0]+t*(p[0]-last[0]),last[1]+t*(p[1]-last[1])))
   if ps>=0:poly.append(p)
   last,ls=p,ps
 return poly

def polygon(key,poly,z=0,top=None):
 if len(poly)<3 or abs(signed(poly))<.15:return False
 if signed(poly)<0:poly=poly[::-1]
 v,f=batches[key];off=len(v);n=len(poly)
 if top is None:
  v.extend([(x*S,y*S,z*S) for x,y in poly]);f.append(tuple(range(off,off+n)))
 else:
  v.extend([(x*S,y*S,z*S) for x,y in poly]);v.extend([(x*S,y*S,top*S) for x,y in poly])
  f.append(tuple(range(off+n,off+2*n)))
  for i in range(n):j=(i+1)%n;f.append((off+i,off+j,off+n+j,off+n+i))
 return True

def strip(key,a,b,width,z):
 dx,dy=b[0]-a[0],b[1]-a[1];length=math.hypot(dx,dy)
 if length<.1:return
 nx,ny=-dy/length*width/2,dx/length*width/2
 polygon(key,clip([(a[0]+nx,a[1]+ny),(a[0]-nx,a[1]-ny),(b[0]-nx,b[1]-ny),(b[0]+nx,b[1]+ny)]),z)
def num(s):
 try:return float(re.findall(r'-?\d+(?:\.\d+)?',str(s))[0])
 except:return None

def rings(e):
 if e.get('geometry'):return [e['geometry']]
 lines=[m['geometry'] for m in e.get('members',[]) if m.get('role') in ['outer',''] and m.get('geometry')]
 result=[]
 while lines:
  line=lines.pop(0)
  while line[0]!=line[-1]:
   found=False
   for i,other in enumerate(lines):
    if other[0]==line[-1]:line+=other[1:];lines.pop(i);found=True;break
    if other[-1]==line[-1]:line+=other[-2::-1];lines.pop(i);found=True;break
   if not found:break
  if len(line)>3 and line[0]==line[-1]:result.append(line)
 return result

outer_members={m['ref'] for e in elements if e['type']=='relation' and (e.get('tags',{}).get('building') or e.get('tags',{}).get('building:part')) for m in e.get('members',[]) if m.get('role')=='outer'}
stats={'buildings':0,'heightMapped':0,'heightFromLevels':0,'heightEstimated':0,'roadWays':0,'greenAreas':0,'simplifiedCourtyards':0}
landmark_ids={295367642:'cc',169103322:'market',743566215:'farrer',743566214:'little',743655241:'novena',176326997:'heritage',102429452:'mall',1232950362:'park'}
anchors={}
for e in elements:
 tags=e.get('tags',{});eid=e['id'];geoms=rings(e)
 if eid in landmark_ids:
  points=geoms[0] if geoms else e.get('geometry',[])
  if points:
   points=points[:-1] if points[0]==points[-1] else points
   coords=[xy(p) for p in points];cx=sum(p[0] for p in coords)/len(coords);cy=sum(p[1] for p in coords)/len(coords)
   anchors[landmark_ids[eid]]={'id':landmark_ids[eid],'name':tags.get('name'),'osmId':eid,'x':round(cx*S,4),'z':round(-cy*S,4),'lat':LAT+cy/110574,'lon':LON+cx/(111320*math.cos(math.radians(LAT)))}
 if tags.get('building') or tags.get('building:part'):
  if e['type']=='way' and eid in outer_members:continue
  for geo in geoms:
   if len(geo)<4 or geo[0]!=geo[-1]:continue
   poly=clip([xy(p) for p in geo[:-1]])
   if len(poly)<3:continue
   height=num(tags.get('height'));levels=num(tags.get('building:levels'));minimum=max(0,num(tags.get('min_height')) or (num(tags.get('building:min_level')) or 0)*3.2)
   if height and height>0:method='heightMapped'
   elif levels and levels>0:height=levels*3.2;method='heightFromLevels'
   else:
    kind=tags.get('building','yes');height= {'apartments':38,'residential':12,'house':8,'terrace':9,'commercial':18,'retail':10,'school':15,'hospital':24,'hotel':30,'office':30,'garage':4,'roof':4}.get(kind,10);method='heightEstimated'
   if eid==295367642:height=15
   if height<=minimum:height=minimum+3.2
   height=min(height,250)
   key='building'+str(eid%5)
   if tags.get('building') in ['commercial','retail','terrace'] or tags.get('shop'):key='retail'
   if tags.get('amenity')=='school' or tags.get('building')=='school':key='school'
   if tags.get('amenity')=='hospital' or tags.get('building')=='hospital':key='hospital'
   if eid in [169103322,176326997,102429452]:key='yellow'
   if eid==295367642:key='coral'
   if polygon(key,poly,minimum+.6,height+.6):stats['buildings']+=1;stats[method]+=1
   polygon('roof' if key.startswith('building') else key,poly,height+.64)
   # Sparse floor accents, no invented individual windows.
   if height>35 and abs(signed(poly))>150:
    for z in range(12,int(height),12):
     for i,a in enumerate(poly):strip('windows',a,poly[(i+1)%len(poly)],.5,z)
   if eid in landmark_ids:anchors[landmark_ids[eid]]['height']=round(height*S,4)
  if e['type']=='relation' and any(m.get('role')=='inner' for m in e.get('members',[])):stats['simplifiedCourtyards']+=1
 if tags.get('highway') and e.get('geometry') and tags.get('highway') not in ['proposed','construction']:
  if tags.get('tunnel')=='yes' or (num(tags.get('layer')) or 0)<0:continue
  kind=tags['highway'];width={'motorway':13,'motorway_link':7,'trunk':13,'primary':12,'secondary':10,'tertiary':8,'residential':6,'service':4,'pedestrian':5,'footway':1.8,'cycleway':2,'path':1.4,'steps':1.5}.get(kind,3)
  ispath=kind in ['footway','cycleway','path','steps'];z=.35 if ispath else .5
  if tags.get('bridge')=='yes':z=5
  g=[xy(p) for p in e['geometry']]
  if any(x*x+y*y<R*R for x,y in g):stats['roadWays']+=1
  for a,b in zip(g,g[1:]):strip('path' if ispath else 'road',a,b,width,z)
 if tags.get('leisure') in ['park','garden','pitch'] or tags.get('natural')=='water':
  for geo in geoms:
   if geo[0]==geo[-1] and polygon('water' if tags.get('natural')=='water' else 'green',clip([xy(p) for p in geo[:-1]]),.15):stats['greenAreas']+=1
 if tags.get('waterway') and e.get('geometry'):
  g=[xy(p) for p in e['geometry']]
  for a,b in zip(g,g[1:]):strip('water',a,b,6,.22)
# Circle and subtle distance rings (actual radial metres, not neighbourhood boundaries).
polygon('ground',boundary,-.05,0)
polygon('edge',[(x*1.01,y*1.01) for x,y in boundary],-17,-.1)
for radius in [500,1000]:
 for i in range(0,180,3):
  a=i*2*math.pi/180;b=(i+1.5)*2*math.pi/180;strip('line',(radius*math.cos(a),radius*math.sin(a)),(radius*math.cos(b),radius*math.sin(b)),1.2,.08)
# Material batches avoid thousands of draw calls on phones.
for key,(verts,faces) in batches.items():
 if not verts:continue
 mesh=bpy.data.meshes.new(key);mesh.from_pydata(verts,[],faces);mesh.update();obj=bpy.data.objects.new(key,mesh);bpy.context.collection.objects.link(obj);obj.data.materials.append(materials[key])
 # Explicit triangulation makes the export consistent for concave roofs.
 mod=obj.modifiers.new('Triangulate map geometry','TRIANGULATE')

def text(n,body,loc,size,ma,rot=(0,0,0)):
 cu=bpy.data.curves.new(n,'FONT');cu.body=body;cu.align_x='CENTER';cu.size=size;cu.extrude=.001;obj=bpy.data.objects.new(n,cu);bpy.context.collection.objects.link(obj);obj.location=loc;obj.rotation_euler=rot;obj.data.materials.append(materials[ma]);return obj
text('North arrow','N  ↑',(0,29,.05),.7,'ink')
text('Radius caption','1.5 km radius  /  PEK KIO & NEIGHBOURS',(0,-31.1,.02),.48,'ink')
text('OSM attribution','© OpenStreetMap contributors  ·  ODbL 1.0',(0,-32,.02),.30,'ink')
# A coral centre marker and tiny landmark masts are illustrative wayfinding devices.
for key in ['cc','market','farrer','little','novena','heritage','mall']:
 a=anchors.get(key)
 if not a:continue
 x,y=a['x'],-a['z'];h=a.get('height',.2)+.8
 bpy.ops.mesh.primitive_cylinder_add(vertices=8,radius=.035,depth=.8,location=(x,y,h-.4));bpy.context.object.data.materials.append(materials['coral' if key=='cc' else 'ink'])
 bpy.ops.mesh.primitive_uv_sphere_add(segments=10,ring_count=6,radius=.11,location=(x,y,h));bpy.context.object.data.materials.append(materials['coral' if key=='cc' else 'yellow']);a['pinHeight']=round(h,3)
# Convert letters; then export geometry without render lighting.
bpy.ops.object.select_all(action='DESELECT')
for obj in list(bpy.context.scene.objects):
 if obj.type=='FONT':
  obj.select_set(True);bpy.context.view_layer.objects.active=obj;bpy.ops.object.convert(target='MESH');obj.select_set(False)
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT,'pek-kio-district.glb'),export_format='GLB',export_cameras=False,export_lights=False,export_draco_mesh_compression_enable=True,export_draco_mesh_compression_level=6)
scene=bpy.context.scene;scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.8,.86,.75,1);scene.world.node_tree.nodes['Background'].inputs[1].default_value=.8
bpy.ops.object.light_add(type='SUN',location=(-20,-20,40));bpy.context.object.rotation_euler=(.45,-.35,-.4);bpy.context.object.data.energy=2;bpy.context.object.data.angle=.12
bpy.ops.object.camera_add(location=(31,-46,48));cam=bpy.context.object;cam.rotation_euler=(Vector((0,0,.5))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=72;scene.camera=cam
scene.render.engine='CYCLES';scene.cycles.samples=40;scene.cycles.use_denoising=True;scene.render.resolution_x=1800;scene.render.resolution_y=1500;scene.render.resolution_percentage=100;scene.render.image_settings.file_format='PNG';scene.render.film_transparent=True;scene.view_settings.view_transform='AgX';scene.view_settings.exposure=.3;scene.render.filepath=os.path.join(OUT,'pek-kio-district.png')
metadata={**source,'sceneUnitsPerMeter':S,'stats':stats,'anchors':list(anchors.values()),'method':'Mapped footprints and roads; mapped heights, levels x 3.2m, or estimated category heights. Flat ground; simplified roofs and courtyards.','buildingHeightCeilingMeters':250}
json.dump(metadata,open(os.path.join(DATA,'district.json'),'w',encoding='utf8'),ensure_ascii=False,indent=2)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT,'pek-kio-district.blend'),compress=True)
bpy.ops.render.render(write_still=True)
print('DISTRICT_COMPLETE '+json.dumps(stats))
