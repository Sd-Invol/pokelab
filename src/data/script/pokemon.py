from bs4 import BeautifulSoup
import json

if __name__ == "__main__":
    soup = BeautifulSoup(
        open('../resources/pkm-list-i18n.html', 'r'), 'html.parser')

    tables = soup.find_all('table')

    en_pokemons_dict = {}
    for table in tables:
        rows = table.find_all('tr')[1:]
        for row in rows:
            cells = row.find_all('td')
            if len(cells) != 4:
                continue

            texts = [cells[i].text.strip() for i in range(4)]
            en_pokemons_dict[texts[3]] = (
                int(texts[0][1:]), texts[1], texts[2])
    abilities = json.load(open('../abilities.json', 'r'))
    moves = json.load(open('../moves.json', 'r'))

    en_abilities_dict = {}
    for ability in abilities[1:]:
        en_abilities_dict[ability['name']['en']] = (
            ability['id'], ability['name']['cn'])
    en_moves_dict = {}
    for move in moves[1:]:
        en_moves_dict[move['name']['en']] = (move['id'], move['name']['cn'])

    stats = list(map(lambda x: x.strip(), open(
        '../resources/pkm-stats.txt', 'r').readlines()))
    pokemons = []
    egg_moves = {}

    i = 0
    # id
    # name
    #   - cn
    #   - en
    #   - ja
    # form : int
    # galardex: int and -1 for foreign
    # base
    #   - hp
    #   - atk
    #   - def
    #   - spatk
    #   - spdef
    #   - spe
    # abilities: list of number
    # ty pe: list of string
    # evolution: list of [(id, form)]
    # moves: list of sorted unique number

    while i + 1 < len(stats):
        if stats[i] == '======':
            i += 1
        id = int(stats[i].split(' -')[0])
        name = stats[i].split('(')[0].split('- ')[1].strip()
        if not name[-1].isdigit():
            name += " 0"
        pokemon = {}

        info = en_pokemons_dict[name.rsplit(' ', 1)[0]]
        pokemon['id'] = info[0]
        pokemon['name'] = {}
        pokemon['name']['cn'] = info[1]
        pokemon['name']['en'] = name.rsplit(' ', 1)[0]
        pokemon['name']['ja'] = info[2]
        pokemon['form'] = int(name.rsplit(' ', 1)[1])
        i += 2

        # Galar Dex
        if '#' in stats[i]:
            pokemon['galardex'] = int(stats[i].split('#')[1])
        else:
            pokemon['galardex'] = -1
        i += 1

        # Base Stats
        base = list(map(int, (stats[i].split(' ')[2]).split('.')))
        pokemon['base'] = {}
        pokemon['base']['hp'] = base[0]
        pokemon['base']['atk'] = base[1]
        pokemon['base']['def'] = base[2]
        pokemon['base']['spatk'] = base[3]
        pokemon['base']['spdef'] = base[4]
        pokemon['base']['spe'] = base[5]
        i += 1

        # EV Yield
        i += 1

        # Abilities
        abilities = list(
            map(lambda x: x.strip(), stats[i].split(':', 1)[1].split('|')))
        pokemon['abilities'] = []
        for ab in abilities:
            pokemon['abilities'].append(
                en_abilities_dict[ab.split('(')[0].strip()][0])
        i += 1

        # Type
        pokemon['type'] = list(
            map(lambda x: x.strip(), stats[i].split(':', 1)[1].split('/')))
        i += 1

        while stats[i].startswith('Item'):
            i += 1
        i += 4

        pokemon['moves'] = []
        if stats[i] == 'Level Up Moves:':
            i += 1
            while stats[i].startswith('-'):
                # Level up moves
                name = stats[i].split('] ')[1]
                pokemon['moves'].append(en_moves_dict[name][0])
                i += 1
        if stats[i] == 'Egg Moves:':
            i += 1
            while stats[i].startswith('-'):
                # Egg moves
                name = stats[i][2:]
                pokemon['moves'].append(en_moves_dict[name][0])
                i += 1
        if stats[i] == 'TMs:':
            i += 1
            while stats[i].startswith('-'):
                # TMs
                name = stats[i].split('] ')[1]
                pokemon['moves'].append(en_moves_dict[name][0])
                i += 1
            if stats[i] == 'None!':
                i += 1
        if stats[i] == 'TRs:':
            i += 1
            while stats[i].startswith('-'):
                # TRs
                name = stats[i].split('] ')[1]
                pokemon['moves'].append(en_moves_dict[name][0])
                i += 1
            if stats[i] == 'None!':
                i += 1

        key = (pokemon['id'], pokemon['form'])
        if key in egg_moves:
            pokemon['moves'] += egg_moves[key]
        pokemon['moves'] = sorted(set(pokemon['moves']))
        egg_moves[key] = pokemon['moves']

        pokemon['evolution'] = []
        while stats[i].startswith('Evolves into '):
            eve = stats[i].split('@')[0].split(' ', 2)[2]
            name, form = eve.rsplit('-', 1)
            id = int(en_pokemons_dict[name][0])
            egg_moves[(id, int(form))] = egg_moves[key]
            pokemon['evolution'].append({'id': int(id), 'form': int(form)})
            i += 1
        while len(stats[i]) == 0:
            i += 1
        if not stats[i].startswith('='):
            i += 3
        pokemons.append(pokemon)

output_file = open('../pokemons.json', 'w')
output_file.write(json.dumps(pokemons, indent=2, ensure_ascii=False))
