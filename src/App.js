import React from 'react';

import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import './App.css';

import PokemonSelector from './PokemonSelector.js'
import StatusCalculator from './StatusCalculator.js'

import pokemons from './data/pokemons';
import moves from './data/moves';
import types from './data/types';

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

        this.types_cn_to_en = {};
        for (let type in types) {
            this.types_cn_to_en[types[type].cn] = type;
        }
    }

    handlePokemonChange(id) {
        this.setState({ pokemon: Number(id) });
    }

    handleStatsChange(stats) {
        this.setState({ stats: stats });
    }

    render() {
        const pokemon = this.state.pokemon;
        const atk = this.state.stats[1];
        const spa = this.state.stats[3];
        const power = function (x) {
            let typeBonus = 1;
            for (let type of pokemons[pokemon].type) {
                if (types[type].cn === moves[x].type) {
                    typeBonus = 1.5;
                }
            }
            if (moves[x].class === '物理') {
                return atk * Number(moves[x].power) * typeBonus;
            } else {
                return spa * Number(moves[x].power) * typeBonus;
            }
        };
        const moveSet = pokemons[this.state.pokemon].moves
            .filter((x) => moves[x].class !== '变化' && !isNaN(moves[x].power))
            .sort((a, b) => power(b) - power(a));

        return (
            <div>
                <Grid container direction="row">
                    <Grid xs={3}>
                        <PokemonSelector
                            id={this.state.pokemon}
                            onPokemonChange={this.handlePokemonChange} />
                    </Grid>
                    <Grid xs={9}>
                        <StatusCalculator
                            pokemon={this.state.pokemon}
                            level={50}
                            stats={this.state.stats}
                            onStatsChange={this.handleStatsChange} />
                    </Grid>
                </Grid>
                <List>
                    {moveSet.map(x => (
                        <ListItem button key={moves[x].id}>
                            <ListItemText >
                                <span>{moves[x].name.cn}</span>
                            </ListItemText>
                        </ListItem>))}
                </List>
            </div>
        );
    }
}

export default App;
