from bs4 import BeautifulSoup
import json

if __name__ == "__main__":
    soup = BeautifulSoup(
        open('./resources/ability-list-i18n.html', 'r'), 'html.parser')

    tables = soup.find_all('table')[:-1]
    abilities = [{}]

    # structure
    # id
    # name
    #   - cn
    #   - ja
    #   - en
    # description

    for table in tables:
        rows = table.find_all('tr')[1:]
        for row in rows:
            cells = row.find_all('td')

            ability = {}
            ability['id'] = int(cells[0].text.strip())
            ability['name'] = {}
            ability['name']['cn'] = cells[1].text.strip()
            ability['name']['ja'] = cells[2].text.strip()
            ability['name']['en'] = cells[3].text.strip()
            ability['description'] = cells[4].text.strip()

            assert(len(abilities) == ability['id'])
            abilities.append(ability)

    output_file = open('./abilities.json', 'w')
    output_file.write(json.dumps(abilities, indent=2, ensure_ascii=False))
