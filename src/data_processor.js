import pokemons from './data/pokemons';
// import moves from './data/moves';
// import types from './data/types';

let pokemonSelectList = [];
const duplicatedForms = [25, 423, 550, 647, 649, 773, 778, 801, 845, 849, 855, 869, 875, 877, 890, 893];

for (let idx in pokemons) {
  let pokemon = pokemons[idx];

  if (pokemon.evolution.length > 0) {
    continue;
  }

  // Removed as Pokemon home is opened.
  // if (pokemon.galardex < 0) {
  //     continue;
  // }

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

// let types_cn_to_en = {};
// for (let type in types) {
//     types_cn_to_en[types[type].cn] = type;
// }

// for (let idx in pokemons) {
//     let pokemon = pokemons[idx];

//     let moveByType = {};
//     for (let moveId of pokemon.moves) {
//         const move = moves[moveId];
//         if (move.class === '变化') {
//             continue;
//         }
//         if (!(move.type in moveByType)) {
//             moveByType[move.type] = {
//                 physical: [],
//                 special: [],
//             }
//         }
//         if (move.class === '物理') {
//             moveByType[move.type].physical.push(move);
//         }
//         if (move.class === '特殊') {
//             moveByType[move.type].special.push(move);
//         }
//     }
//     for (let type in moveByType) {
//         moveByType[type].physical = moveByType[type].physical.sort(
//             (a, b) => Number(b.power) - Number(a.power));
//         moveByType[type].special = moveByType[type].special.sort(
//             (a, b) => Number(b.power) - Number(a.power));
//     }
// }

export { pokemonSelectList };
