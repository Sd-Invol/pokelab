import React from 'react';

import './App.css';

import PokemonSelector from './PokemonSelector.js'
import StatusCalculator from './StatusCalculator.js'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.handlePokemonChange = this.handlePokemonChange.bind(this);
        this.handleStatsChange = this.handleStatsChange.bind(this);

        this.state = {
            pokemon: 5,
            level: 50,
            stats: [0, 0, 0, 0, 0, 0],
        };
    }

    handlePokemonChange(id) {
        this.setState({ pokemon: Number(id) });
    }

    handleStatsChange(stats) {
        this.setState({ stats: stats });
    }

    render() {
        return (
            <div>
                <PokemonSelector
                    id={this.state.pokemon}
                    onPokemonChange={this.handlePokemonChange} />
                <StatusCalculator
                    pokemon={this.state.pokemon}
                    level={50}
                    stats={this.state.stats}
                    onStatsChange={this.handleStatsChange} />
            </div>
        );
    }
}

export default App;
