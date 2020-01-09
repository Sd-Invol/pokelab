import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import * as dataProcessor from './dataProcessor.js';

class PokemonSelector extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.props.onPokemonChange(event.target.value);
    }

    render() {
        return (
            <div className="App">
                <FormControl style={{ minWidth: 240 }}>
                    <InputLabel>宝可梦</InputLabel>
                    <Select
                        value={this.props.id}
                        onChange={this.handleChange}>
                        {dataProcessor.pokemonList}
                    </Select>
                </FormControl>
            </div>
        );
    }
}

export default PokemonSelector;