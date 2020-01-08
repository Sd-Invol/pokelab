import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import pokemons from './data/pokemons'
import * as dataProcessor from './dataProcessor.js';

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
    console.log(event.target.value);
  };

  return (
    <div className="App">
      <FormControl className={classes.formControl}>
        <InputLabel>宝可梦</InputLabel>
        <Select
          value={age}
          onChange={handleChange}
        >
          {dataProcessor.pokemonList}
        </Select>
      </FormControl>
    </div>
  );
}

export default App;
