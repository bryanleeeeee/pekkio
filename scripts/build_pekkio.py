"""Pek Kio CC: photo-inspired miniature, not a surveyed architectural model.
Run: blender --background --python scripts/build_pekkio.py -- /absolute/output/directory
Reference: onePA Pek Kio CC photograph. Geometry and surroundings are artistic interpretations.
"""
import bpy, math, random, sys, os
from mathutils import Vector
random.seed(24)
out = sys.argv[sys.argv.index('--')+1] if '--' in sys.argv else os.path.join(os.getcwd(),'public','models')
os.makedirs(out,exist_ok=True)
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
def mat(n,c,rough=.65):
 m=bpy.data.materials.new(n);m.diffuse_color=(*c,1);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*c,1);p.inputs['Roughness'].default_value=rough;return m
cream=mat('Warm ivory',(0.87,.84,.72));coral=mat('CC coral terracotta',(.78,.36,.29));rib=mat('Sunlit coral fins',(.94,.52,.43));gold=mat('Golden lower storeys',(.92,.67,.24));mint=mat('School mint',(.48,.73,.60));glass=mat('Deep teal glazing',(.12,.29,.28),.28);sage=mat('Garden lawn',(.48,.64,.38));leaf=mat('Canopy light',(.50,.65,.32));leaf2=mat('Canopy dark',(.27,.47,.30));bark=mat('Tree trunks',(.39,.30,.22));road=mat('Quiet graphite street',(.37,.43,.43));walk=mat('Warm paving',(.78,.76,.65));white=mat('Warm white',(.98,.96,.85));dark=mat('Signboard',(.17,.24,.26));rose=mat('Coral lettering',(.98,.52,.48));lav=mat('Neighbouring homes',(.70,.66,.75));water=mat('Court mint',(.41,.66,.56));blue=mat('Pastel blue',(.47,.64,.70))
def box(n,loc,scale,ma,bevel=0):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=n;o.dimensions=scale;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(ma)
 if bevel:
  mod=o.modifiers.new('Soft miniature edges','BEVEL');mod.width=bevel;mod.segments=2;o.modifiers.new('Weighted normals','WEIGHTED_NORMAL')
 return o
def cyl(n,loc,r,depth,ma):
 bpy.ops.mesh.primitive_cylinder_add(vertices=10,radius=r,depth=depth,location=loc);o=bpy.context.object;o.name=n;o.data.materials.append(ma);return o
def text(n,body,loc,size,ma,rotation=(math.pi/2,0,0)):
 cu=bpy.data.curves.new(n,'FONT');cu.body=body;cu.align_x='CENTER';cu.align_y='CENTER';cu.size=size;cu.extrude=.006;cu.bevel_depth=.002;o=bpy.data.objects.new(n,cu);bpy.context.collection.objects.link(o);o.location=loc;o.rotation_euler=rotation;o.data.materials.append(ma);return o
def tree(x,y,s=1):
 cyl('Rain-tree trunk',(x,y,1.5*s),.17*s,3*s,bark)
 for dx,dy,dz,r in [(-.65,0,3.3,1.25),(.65,.1,3.6,1.5),(0,-.5,4.05,1.4)]:
  bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2,radius=r*s,location=(x+dx*s,y+dy*s,dz*s));o=bpy.context.object;o.name='Faceted tropical tree canopy';o.scale=(1.15,1,.8);o.data.materials.append(leaf if dx<0 else leaf2)
def person(x,y,color):
 cyl('Neighbour',(x,y,.43),.12,.65,color);bpy.ops.mesh.primitive_uv_sphere_add(segments=8,ring_count=4,radius=.13,location=(x,y,.9));bpy.context.object.data.materials.append(cream)
# A bounded diorama plinth; placement is a composition rather than a measured map.
box('Rounded neighbourhood plinth',(0,1,-.65),(43,32,1.3),cream,.6)
box('Lawn base',(0,1,.02),(42,31,.15),sage,.3)
box('Gloucester Road',(0,-10,.14),(42,5,.14),road,.1)
box('CC-side footpath',(0,-6.9,.20),(42,1.1,.2),walk,.1)
box('Street-side footpath',(0,-13,.2),(42,.8,.2),walk,.1)
for x in range(-19,21,4):box('Road centre dash',(x,-10,.23),(1.6,.09,.02),white)
for x in [-.9,-.35,.2,.75,1.3,1.85]:box('Zebra crossing',(x,-10,.25),(.3,4,.025),white)
text('Street name','GLOUCESTER ROAD',(9,-11.7,.25),.65,white,(0,0,0))
# Four-storey CC with signature large ribbed coral screen and sunny yellow lower block.
box('CC ivory volume',(-6,0,6),(13,9,12),cream,.12)
box('CC yellow lower floors',(-7,-4.6,2.8),(10,.35,5),gold,.04)
for z in [1.7,3.9]:
 box('Lower floor teal windows',(-7,-4.82,z),(9.4,.08,1.35),glass)
 for x in [-11.4,-9.5,-7.6,-5.7,-3.8,-2.4]:box('Window mullions',(x,-4.88,z),(.07,.06,1.5),cream)
 box('Balcony edge',(-7,-5.25,z-.8),(10.2,.75,.15),cream)
 for x in [-11.8,-9.9,-8,-6.1,-4.2,-2.2]:box('Balcony rail uprights',(x,-5.6,z-.35),(.045,.045,.8),dark)
 box('Balcony handrail',(-7,-5.6,z+.05),(10,.055,.07),dark)
box('Coral facade screen',(-6.5,-4.85,9),(10.5,.48,7),coral,.04)
for i in range(37):box('Vertical coral facade fin',(-11.65+i*.285,-5.13,9),(.09,.15,6.95),rib,.015)
box('Pek Kio signboard',(-6.5,-5.5,5.9),(7.2,.5,1.35),dark,.08)
text('Pek Kio title','Pek Kio',(-6.5,-5.78,6.17),.72,rose)
text('Community Centre lettering','COMMUNITY CENTRE',(-6.5,-5.78,5.55),.30,white)
# Glazed side entrance, pillars and long covered walkway.
box('Entrance glass',(1,-3.8,2.1),(2.5,.14,3.7),glass)
for x in [-.5,2.5]:box('Entrance pillars',(x,-4.5,2),(.28,.35,4),cream)
box('Entry canopy',(-4,-5.7,2.1),(21,2.1,.18),dark,.06)
for x in [-13,-9,-1,5]:box('Walkway posts',(x,-6.1,1.1),(.12,.12,2.1),cream)
box('Entry path',(1,-4,.23),(3.8,5.4,.2),walk)
for z in [7,9.5]:
 box('Right side window',(0.1,-4.57,z),(1.6,.07,1.6),glass)
 for dx in [-.5,0,.5]:box('Window screen',(dx,-4.65,z),(.07,.1,1.7),cream)
# Linked school wing, set back to keep the CC visually dominant.
box('School east wing',(10,4,3.7),(11,7,7.4),cream,.12)
box('School mint corner',(15.55,3.9,3.7),(.28,7,7.4),mint)
for z in [1.7,4,6.3]:
 box('School corridor glazing',(10,.43,z),(10,.12,1.15),glass)
 box('School floor band',(10,.26,z-.75),(11.1,.2,.25),mint)
 for x in [5,7,9,11,13,15]:box('School columns',(x,.15,3.7),(.15,.3,7.4),cream)
box('School roof',(10,4,7.52),(11.5,7.5,.24),mint,.05)
text('School sign','FARRER PARK PRIMARY',(10,.01,6.8),.34,dark)
box('Shared sheltered link',(2.9,2.3,3.2),(4,3,.25),cream,.08)
# Small suggested school field behind the campus.
box('School field',(1,11,.16),(15,7,.12),water,.08)
for x,y,sx,sy in [(1,7.6,14,.08),(1,14.3,14,.08),(-6,10.95,.08,6.8),(8,10.95,.08,6.8),(1,10.95,.08,6.8)]:box('Field markings',(x,y,.25),(sx,sy,.02),white)
# Context blocks: deliberately simplified, no surveyed building claims.
for x,y,w,h in [(-17,9,5,9),(16,12,6,10)]:
 box('Simplified residential context',(x,y,h/2),(w,5,h),lav,.14)
 for z in range(2,h,2):
  for dx in [-1.4,0,1.4]:box('Context windows',(x+dx,y-2.55,z),(.8,.05,.85),glass)
 box('Context roof',(x,y,h+.15),(w+.3,5.3,.3),cream,.05)
# Landscaping and everyday life.
for x,y,s in [(-17,-4,1.1),(-14,1,.9),(6,-4.2,1.05),(16,-4.2,1.2),(19,4,.85),(-10,12,.8),(11,12,.7),(-18,-13,.55),(16,-13,.6)]:tree(x,y,s)
for x in [-14,-11,7,10,13]:
 box('Hedge planter',(x,-5.9,.4),(1.7,.55,.45),cream,.08)
 for dx in [-.5,0,.5]:
  bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1,radius=.46,location=(x+dx,-5.9,.9));bpy.context.object.data.materials.append(leaf)
for x,y in [(-1,-6.6),(5,-6.6)]:
 box('Bench seat',(x,y,.55),(1.5,.42,.13),bark,.04)
 for dx in [-.55,.55]:box('Bench leg',(x+dx,y,.3),(.1,.35,.5),dark)
for x,y,c in [(-2,-6.8,coral),(1,-5.8,blue),(3,-6.7,gold),(9,-6.9,mint),(-10,-6.6,lav)]:person(x,y,c)
for x,y,c in [(-13,-9,white),(11,-11,blue)]:
 box('Neighbourhood car',(x,y,.68),(2.6,1.2,.7),c,.22);box('Car cabin',(x,y,1.19),(1.3,1.08,.55),glass,.18)
 for dx in [-.8,.8]:
  for dy in [-.6,.6]:
   o=cyl('Car wheels',(x+dx,y+dy,.45),.3,.16,dark);o.rotation_euler[0]=math.pi/2
# Plinth caption faces the camera.
text('Diorama title','PEK KIO  /  A LITTLE CORNER OF HOME',(0,-15.12,-.55),.55,dark)
# Export only scene geometry; convert text for GLB interoperability.
for o in list(bpy.context.scene.objects):
 if o.type=='FONT':
  bpy.context.view_layer.objects.active=o;o.select_set(True);bpy.ops.object.convert(target='MESH');o.select_set(False)
bpy.ops.export_scene.gltf(filepath=os.path.join(out,'pek-kio-cc.glb'),export_format='GLB',export_cameras=False,export_lights=False)
# Soft, bright studio lighting for the still picture.
world=bpy.context.scene.world;world.use_nodes=True;world.node_tree.nodes['Background'].inputs[0].default_value=(.78,.84,.77,1);world.node_tree.nodes['Background'].inputs[1].default_value=.7
bpy.ops.object.light_add(type='AREA',location=(-12,-15,28));bpy.context.object.name='Large softbox';bpy.context.object.data.energy=4200;bpy.context.object.data.shape='DISK';bpy.context.object.data.size=15
bpy.ops.object.light_add(type='SUN',location=(6,-4,20));bpy.context.object.rotation_euler=(.35,-.4,-.4);bpy.context.object.data.energy=1.5;bpy.context.object.data.angle=.15
bpy.ops.object.camera_add(location=(39,-53,36));cam=bpy.context.object;direction=Vector((0,1,3))-cam.location;cam.rotation_euler=direction.to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=59;bpy.context.scene.camera=cam
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=32;scene.cycles.use_denoising=True;scene.render.resolution_x=1600;scene.render.resolution_y=1100;scene.render.resolution_percentage=100;scene.render.image_settings.file_format='PNG';scene.render.film_transparent=True;scene.render.filepath=os.path.join(out,'pek-kio-cc.png')
scene.view_settings.view_transform='AgX';scene.view_settings.exposure=.5
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,'pek-kio-cc.blend'),compress=True)
bpy.ops.render.render(write_still=True)
print('PEK KIO SCENE COMPLETE')
