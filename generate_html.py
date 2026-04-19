
import os, glob

images = []
for ext in ['*.jpg', '*.JPG', '*.png', '*.PNG']:
    images.extend(glob.glob('All/' + ext))

videos = glob.glob('Video/Slide-3/*.mp4')

print('Images:', len(images))
print('Videos:', len(videos))
print('Total files:', len(images) + len(videos))

html = []
for img in images:
    html.append(f'''<div class="relative rounded-[1rem] overflow-hidden shadow-xl group hover:scale-105 transition-transform">
  <img src="{img}" class="w-full h-48 object-cover" alt="Memory" />
  <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
    <span class="text-white text-sm font-semibold">💕</span>
  </div>
</div>''')

for vid in videos:
    html.append(f'''<div class="relative rounded-[1rem] overflow-hidden shadow-xl group hover:scale-105 transition-transform bg-black">
  <video class="w-full h-48 object-cover" autoplay muted loop playsinline>
    <source src="{vid}" type="video/mp4" />
  </video>
  <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
    <span class="text-white text-sm font-semibold">🎬</span>
  </div>
</div>''')

with open('slide5_grid.html', 'w', encoding='utf-8') as f:
    f.write('\n'.join(html))

print('HTML written to slide5_grid.html')