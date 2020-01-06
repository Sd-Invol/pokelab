from bs4 import BeautifulSoup
import json

if __name__ == "__main__":
    soup = BeautifulSoup(
        open('./resources/pkm-list-i18n.html', 'r'), 'html.parser')

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
    abilities = json.load(open('./abilities.json', 'r'))
    moves = json.load(open('./moves.json', 'r'))

    en_abilities_dict = {}
    for ability in abilities[1:]:
        en_abilities_dict[ability['name']['en']] = (
            ability['id'], ability['name']['cn'])
    en_moves_dict = {}
    for move in moves[1:]:
        en_moves_dict[move['name']['en']] = (move['id'], move['name']['cn'])

    stats = list(map(lambda x: x.strip(), open(
        './resources/pkm-stats.txt', 'r').readlines()))

    i = 0

    while i + 1 < len(stats):
        if stats[i] == '======':
            i += 1
        name = stats[i].split('(')[0].split('- ')[1]
        print(name)
        i += 2
        i += 5
        while stats[i].startswith('Item'):
            i += 1
        i += 4
        if stats[i] == 'Level Up Moves:':
            i += 1
            while stats[i].startswith('-'):
                # Level up moves
                name = stats[i].split('] ')[1]
                # print(en_moves_dict[name][1])
                i += 1
        if stats[i] == 'Egg Moves:':
            i += 1
            while stats[i].startswith('-'):
                # Egg moves
                name = stats[i][2:]
                # print(en_moves_dict[name][1])
                i += 1
        if stats[i] == 'TMs:':
            i += 1
            while stats[i].startswith('-'):
                # TMs
                name = stats[i].split('] ')[1]
                # print(en_moves_dict[name][1])
                i += 1
            if stats[i] == 'None!':
                i += 1
        if stats[i] == 'TRs:':
            i += 1
            while stats[i].startswith('-'):
                # TRs
                name = stats[i].split('] ')[1]
                # print(en_moves_dict[name][1])
                i += 1
            if stats[i] == 'None!':
                i += 1

        while stats[i].startswith('Evolves into '):
            i += 1
        while len(stats[i]) == 0:
            i += 1
        if not stats[i].startswith('='):
            i += 3

    # # structure
    # # id
    # # name
    # #   - cn
    # #   - ja
    # #   - en
    # # description

    # for table in tables:
    #     rows = table.find_all('tr')[1:]
    #     for row in rows:
    #         cells = row.find_all('td')

    #         ability = {}
    #         ability['id'] = int(cells[0].text.strip())
    #         ability['name'] = {}
    #         ability['name']['cn'] = cells[1].text.strip()
    #         ability['name']['ja'] = cells[2].text.strip()
    #         ability['name']['en'] = cells[3].text.strip()
    #         ability['description'] = cells[4].text.strip()

    #         assert(len(abilities) == ability['id'])
    #         abilities.append(ability)

    # output_file = open('./abilities.json', 'w')
    # output_file.write(json.dumps(abilities, indent=2, ensure_ascii=False))
