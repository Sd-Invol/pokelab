import React from 'react';

import './App.css';

import Input from '@material-ui/core/Input';
import Slider from '@material-ui/core/Slider';

import PokemonSelector from './PokemonSelector.js'
import pokemons from './data/pokemons';
import { Grid } from '@material-ui/core';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.handlePokemonChange = this.handlePokemonChange.bind(this);
        this.handleEVBlur = this.handleEVBlur.bind(this);

        this.state = { pokemon: 5, IVs: [31, 31, 31, 31, 31, 31], EVs: [0, 0, 0, 0, 0, 0] };
    }

    handlePokemonChange(id) {
        this.setState({ pokemon: id });
    }

    getBaseValues() {
        const base = pokemons[this.state.pokemon].base;
        return [base.hp, base.atk, base.def, base.spatk, base.spdef, base.spe];
    }

    handleIVChanges(idx, e) {
        let IVs = this.state.IVs;
        IVs[idx] = e.target.value;
        this.setState({ IVs: IVs });
    }

    handleEVChanges(idx, e, newValue) {
        let EVs = this.state.EVs;
        EVs[idx] = newValue;
        this.setState({ EVs: EVs });
    }

    handleEVInputChanges(idx, e) {
        let EVs = this.state.EVs;
        EVs[idx] = Number(e.target.value);
        this.setState({ EVs: EVs });
    }

    handleEVBlur() {
        let EVs = this.state.EVs;
        for (let i = 0; i < 6; ++i) {
            EVs[i] = Math.max(0, Math.min(252, EVs[i]));
            EVs[i] = Math.round(EVs[i] / 4) * 4;
        }
        this.setState({ EVs: EVs });
    }

    render() {
        const values = this.getBaseValues();
        return (
            <div>
                <PokemonSelector
                    id={this.state.pokemon}
                    onPokemonChange={this.handlePokemonChange} />
                <div>{JSON.stringify(pokemons[this.state.pokemon])}</div>
                <div style={{ width: '50%' }}>
                    {[0, 1, 2, 3, 4, 5].map((x) => (
                        <Grid container direction="row" key={x}>
                            <Grid item xs> {values[x]}</Grid>
                            <Grid item xs>
                                <Input
                                    inputProps={{ min: 0, max: 31, step: 1 }}
                                    value={this.state.IVs[x]}
                                    onChange={this.handleIVChanges.bind(this, x)}
                                    type="number"
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs>
                                <Slider
                                    value={typeof this.state.EVs[x] == 'number' ? this.state.EVs[x] : 0}
                                    onChange={this.handleEVChanges.bind(this, x)}
                                    step={4}
                                    min={0}
                                    max={252}
                                />
                            </Grid>
                            <Grid item>
                                <Input
                                    value={this.state.EVs[x]}
                                    onChange={this.handleEVInputChanges.bind(this, x)}
                                    onBlur={this.handleEVBlur}
                                    inputProps={{
                                        step: 4,
                                        min: 0,
                                        max: 252,
                                        type: 'number',
                                    }}
                                />
                            </Grid>
                        </Grid>
                    ))}
                </div>
            </div >
        );
    }
}

export default App;
