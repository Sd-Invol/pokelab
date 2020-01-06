from bs4 import BeautifulSoup
import json

if __name__ == "__main__":
    soup = BeautifulSoup(
        open('./resources/move-list-i18n.html', 'r'), 'html.parser')

    tables = soup.find_all('table')[3:-1]
    moves = [{}]

    # structure
    # id: int
    # name
    #   - cn
    #   - ja
    #   - en
    # ty pe: striing
    # class: string
    # power: string
    # accuracy: string
    # PP: string
    # description: string

    for table in tables:
        rows = table.find_all('tr')[1:]
        for row in rows:
            cells = row.find_all('td')
            if len(cells) != 10:
                continue
            texts = [cells[i].text.strip() for i in range(10)]
            if texts[0] == '???':
                continue

            move = {}
            move['id'] = int(texts[0])
            move['name'] = {}
            move['name']['cn'] = texts[1]
            move['name']['ja'] = texts[2]
            move['name']['en'] = texts[3]
            move['type'] = texts[4]
            move['class'] = texts[5]
            move['power'] = texts[6]
            move['accuracy'] = texts[7]
            move['PP'] = texts[8]
            move['description'] = texts[9]

            assert(len(moves) == move['id'])
            moves.append(move)

    output_file = open('./moves.json', 'w')
    output_file.write(json.dumps(moves, indent=2, ensure_ascii=False))
