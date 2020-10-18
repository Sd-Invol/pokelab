import React from 'react';

import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import './App.css';

import PokemonSelector from './PokemonSelector.js'
import StatusCalculator from './StatusCalculator.js'
import * as dataProcessor from './data_processor.js';

import pokemons from './data/pokemons';
import moves from './data/moves';
import types from './data/types';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.handlePokemonChange = this.handlePokemonChange.bind(this);
        this.calDamage = this.calDamage.bind(this);

        this.state = {
            pokemon: 5,
            level: 50,
            stats: [0, 0, 0, 0, 0, 0],
            move: -1,
        };

        this.types_cn_to_en = {};
        for (let type in types) {
            this.types_cn_to_en[types[type].cn] = type;
        }
    }

    handlePokemonChange(id) {
        this.setState({ pokemon: Number(id), move: -1 });
    }

    calDamage(foeId, extreme) {
        if (this.state.move === -1) {
            return "";
        }

        const move = moves[this.state.move];
        const base = pokemons[foeId].base;

        let hp = base.hp, def = base.def, power = Number(move.power);
        if (move.class === '特殊') {
            def = base.spdef;
            power *= this.state.stats[3];
        } else {
            power *= this.state.stats[1];
        }

        if (!extreme) {
            hp = Math.floor(this.state.level * (hp * 2 + 31) / 100) + this.state.level + 10;
            def = Math.floor(this.state.level * (def * 2 + 31) / 100) + 5;
        } else {
            hp = Math.floor(this.state.level * (hp * 2 + 31 + 63) / 100) + this.state.level + 10;
            def = Math.floor((Math.floor(this.state.level * (def * 2 + 31 + 63) / 100) + 5) * 1.1);
        }

        let typeBonus = 1;
        for (let type of pokemons[this.state.pokemon].type) {
            if (types[type].cn === move.type) {
                typeBonus *= 1.5;
            }
        }
        let type = types[this.types_cn_to_en[move.type]];
        for (let t of pokemons[foeId].type) {
            typeBonus *= type[t];
        }
        let maxDamage = ((2 * this.state.level + 10) / 250 * power / def + 2) * typeBonus;
        let minDamage = maxDamage * 0.85;
        let maxPercent = maxDamage / hp * 100;
        let minPercent = minDamage / hp * 100;

        return `[${minPercent.toFixed(2)}%, ${maxPercent.toFixed(2)}%]`;
    }

    getDamage(foeId) {
        if (this.state.move === -1) {
            return 0;
        }

        const move = moves[this.state.move];
        const base = pokemons[foeId].base;

        let hp = base.hp, def = base.def, power = Number(move.power);
        if (move.class === '特殊') {
            def = base.spdef;
            power *= this.state.stats[3];
        } else {
            power *= this.state.stats[1];
        }

        hp = Math.floor(this.state.level * (hp * 2 + 31) / 100) + this.state.level + 10;
        def = Math.floor(this.state.level * (def * 2 + 31) / 100) + 5;

        let typeBonus = 1;
        for (let type of pokemons[this.state.pokemon].type) {
            if (types[type].cn === move.type) {
                typeBonus *= 1.5;
            }
        }
        let type = types[this.types_cn_to_en[move.type]];
        for (let t of pokemons[foeId].type) {
            typeBonus *= type[t];
        }
        return ((2 * this.state.level + 10) / 250 * power / def + 2) * typeBonus / hp;
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


        const damages = {};
        for (let pokemon of dataProcessor.pokemonSelectList) {
            damages[pokemon.value] = this.getDamage(pokemon.value, false);
        }

        return (
            <div>
                <Grid container direction="row">
                    <Grid item xs={3}>
                        <PokemonSelector
                            id={this.state.pokemon}
                            onPokemonChange={this.handlePokemonChange} />
                    </Grid>
                    <Grid item xs={9}>
                        <StatusCalculator
                            pokemon={this.state.pokemon}
                            level={50}
                            stats={this.state.stats}
                            onStatsChange={(stats) => this.setState({ stats: stats })} />
                    </Grid>
                </Grid>
                <Grid container direction="row">
                    <Grid item xs={2}>
                        <List dense={true}>
                            {moveSet.map(x => (
                                <ListItem button key={moves[x].id}
                                          alignItems="center"
                                          onClick={() => this.setState({ move: moves[x].id })}
                                          selected={this.state.move === moves[x].id}>
                                    <img src={process.env.PUBLIC_URL  + `/types/${this.types_cn_to_en[moves[x].type].toLowerCase()}.svg`} 
                                         style={{ height: "20px", marginRight: "2px" }} alt={x}/>
                                    <span>{moves[x].name.cn}({moves[x].power})</span>
                                </ListItem>))}
                        </List>
                    </Grid>
                    <Grid item xs={10}>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="right">宝可梦</TableCell>
                                        <TableCell align="right">无耐久伤害</TableCell>
                                        <TableCell align="right">极限耐久伤害</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dataProcessor.pokemonSelectList.sort((a, b) =>
                                        damages[b.value] - damages[a.value]
                                    ).map((pokemon) => (
                                        <TableRow key={pokemon.value}>
                                            <TableCell align="right">
                                                <div style={{ height: "32px" }}>
                                                    <img src={process.env.PUBLIC_URL + `/sprites/${pokemon.key}.png`}
                                                        alt={pokemon.idx}
                                                        style={{ height: "100%" }}/>
                                                    <span>
                                                        {pokemon.name}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell align="right">{this.calDamage(pokemon.value, false)}</TableCell>
                                            <TableCell align="right">{this.calDamage(pokemon.value, true)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default App;
