import React from 'react';
import * as dataProcessor from './data_processor.js';

import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

class PokemonSelector extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);

        this.value = dataProcessor.pokemonSelectList.find((pokemon) => Number(pokemon.value) === this.props.id);
    }

    static get propTypes() {
        return {
            id: PropTypes.number,
            onPokemonChange: PropTypes.func
        };
    }

    handleChange(event, newValue) {
        if (newValue) {
            this.value = newValue;
            this.props.onPokemonChange(newValue.value);
        }
    }

    render() {
        return (
            <Grid container direction="row" justify="flex-start">
                <img src={process.env.PUBLIC_URL + `/sprites/${this.value.key}.png`} style={{ height: "48px" }}
                    alt={this.value.idx} />
                <Autocomplete
                    style={{ width: 240 }}
                    value={this.value}
                    onChange={this.handleChange}
                    options={dataProcessor.pokemonSelectList}
                    getOptionSelected={(option, value) => option.value === value.value}
                    getOptionLabel={(pokemon) => pokemon.name}
                    renderOption={(pokemon) => (
                        <React.Fragment>
                            <Grid container justify="flex-start" alignItems="center">
                                <Grid item container xs={4} justify="center" alignItems="center">
                                    <img src={process.env.PUBLIC_URL + `/sprites/${pokemon.key}.png`} style={{ height: "40px" }}
                                        alt={pokemon.idx} />
                                </Grid>
                                <span>{pokemon.name}</span>
                            </Grid>
                        </React.Fragment>
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="宝可梦"
                            variant="outlined"
                            inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password', // disable autocomplete and autofill
                            }}
                        />
                    )}
                />
            </Grid>
        );
    }
}

export default PokemonSelector;