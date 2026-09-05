import bpy, os
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
path=os.path.join(root,'public','models')
bpy.ops.wm.open_mainfile(filepath=os.path.join(path,'pek-kio-district.blend'))
bpy.ops.export_scene.gltf(filepath=os.path.join(path,'pek-kio-district.glb'),export_format='GLB',export_cameras=False,export_lights=False,export_draco_mesh_compression_enable=True,export_draco_mesh_compression_level=6)
