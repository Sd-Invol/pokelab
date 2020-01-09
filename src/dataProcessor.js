import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';

import pokemons from './data/pokemons';
import abilities from './data/abilities';
import moves from './data/moves';

let pokemonSelectList = [];
const duplicatedForms = [25, 773, 778, 845, 855, 869, 875, 890];

for (let idx in pokemons) {
    let pokemon = pokemons[idx];

    if (pokemon.evolution.length > 0) {
        continue;
    }
    if (pokemon.galardex < 0) {
        continue;
    }

    if (duplicatedForms.includes(pokemon.id) && pokemon.form > 0) {
        continue;
    }

    let select = {
        value: idx,
        key: pokemon.id + '_' + pokemon.form,
        name: pokemon.name.cn + ` #${pokemon.id}`,
    };
    pokemonSelectList.push(select);
}

let pokemonList = [];
for (let pokemon of pokemonSelectList) {
    pokemonList.push(
        <MenuItem value={pokemon.value} key={pokemon.key}>
            <span>
                <img src={`./sprites/${pokemon.key}.png`}
                    alt={pokemon.idx}
                />
            </span>
            <span>{pokemon.name}</span>
        </MenuItem>)
}


export { pokemonList, pokemons };

