import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import PropTypes from 'prop-types';
import * as dataProcessor from './data_processor.js';

class PokemonSelector extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);

        this.pokemonList = dataProcessor.pokemonSelectList.map((pokemon) => (
            <MenuItem value={pokemon.value} key={pokemon.key}>
                <span>
                    <img src={process.env.PUBLIC_URL + `/sprites/${pokemon.key}.png`} style={{ height: "50px" }}
                        alt={pokemon.idx}
                    />
                </span>
                <span>{pokemon.name}</span>
            </MenuItem>
        ));
    }

    static get propTypes() {
        return {
            id: PropTypes.number,
            onPokemonChange: PropTypes.func
        };
    }

    handleChange(event) {
        this.props.onPokemonChange(event.target.value);
    }

    render() {
        return (
            <FormControl style={{ minWidth: 240 }}>
                <InputLabel>宝可梦</InputLabel>
                <Select
                    value={this.props.id}
                    onChange={this.handleChange}>
                    {this.pokemonList}
                </Select>
            </FormControl>
        );
    }
}

export default PokemonSelector;