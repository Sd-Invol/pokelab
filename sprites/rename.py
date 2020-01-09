import os
import json

pokemons = json.load(open('../src/data/pokemons.json', 'r'))

form_counter = {}
id_to_name = {}

for pokemon in pokemons:
    id = pokemon['id']
    if id not in form_counter:
        form_counter[id] = 0
    form_counter[id] += 1
    id_to_name[id] = pokemon['name']['cn']

# for id in form_counter:
#     if form_counter[id] > 1:
#         print(id, id_to_name[id], form_counter[id])

skip = [3, 12, 25, 26, 44, 45, 111, 112, 118,
        119, 129, 130, 133, 178, 185, 194, 195,
        202, 208, 215, 221, 224, 272, 274, 275,
        315, 350, 407, 415, 449, 450, 453, 454,
        459, 460, 461, 464, 473]

form_counter[521] += 1
form_counter[592] += 1
form_counter[593] += 1

form_counter[890] -= 1

idx = 2

os.system('rm result/*')

for pokemon in pokemons:
    id = pokemon['id']
    if pokemon['form'] > 0:
        continue
    if id in skip:
        idx += 1
    for i in range(form_counter[id]):
        f = 'f-%d.png' % idx
        t = 'result/%d_%d.png' % (id, i)
        cmd = 'cp %s %s' % (f, t)
        os.system(cmd)
        idx += 1

os.system('pwd')
