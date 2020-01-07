import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import pokemons from './data/pokemons'

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function App() {
  const classes = useStyles();
  const [age, setAge] = React.useState('');

  const handleChange = event => {
    setAge(event.target.value);
    console.log(age);
  };

  let pokemonList = [];
  for (let pokemon of pokemons) {
    if (pokemon.evolution.length > 0) {
      continue;
    }
    if (pokemon.galardex < 0) {
      continue;
    }
    if (pokemon.form > 0) {
      continue;
    }
    pokemonList.push(
      <MenuItem value={pokemon.id + '.' + pokemon.form} key={pokemon.id}>
        <span>
          <img src={`https://s.pokeuniv.com/pokemon/icon/${pokemon.form ? pokemon.id + '.' + pokemon.form : pokemon.id}.png`} alt={pokemon.id} />
        </span>
        <span>{pokemon.name.cn}</span>
      </MenuItem>)
  }
  console.log(pokemonList.length);

  return (
    <div className="App">
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">宝可梦</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          onChange={handleChange}
        >
          {pokemonList}
        </Select>
      </FormControl>
    </div>
  );
}

export default App;
