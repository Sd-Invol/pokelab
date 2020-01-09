import React from 'react';

import './App.css';

import PokemonSelector from './PokemonSelector.js'
import pokemons from './data/pokemons';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.handlePokemonChange = this.handlePokemonChange.bind(this);

    this.state = { pokemon: 0 };
  }

  handlePokemonChange(id) {
    this.setState({ pokemon: id });
  }

  render() {
    return (
      <div>
        <PokemonSelector
          id={this.state.pokemon}
          onPokemonChange={this.handlePokemonChange} />
        <div>{JSON.stringify(pokemons[this.state.pokemon])}</div>
      </div>
    );
  }
}

export default App;
