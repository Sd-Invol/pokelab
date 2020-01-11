import React from 'react';
import PropTypes from 'prop-types';

import Input from '@material-ui/core/Input';
import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';

import pokemons from './data/pokemons';

class StatusCalculator extends React.Component {
    constructor(props) {
        super(props);
        this.handleEVBlur = this.handleEVBlur.bind(this);

        this.state = {
            IVs: [31, 31, 31, 31, 31, 31],
            EVs: [0, 0, 0, 0, 0, 0],
            natureBuff: 0,
            natureNerf: 0,
        };
    }

    static get propTypes() {
        return {
            pokemon: PropTypes.number,
            level: PropTypes.number,
            stats: PropTypes.arrayOf(PropTypes.number),
            onStatsChange: PropTypes.func,
        };
    }

    componentDidMount() {
        this.updateStats(this.state.IVs, this.state.EVs, 0, 0);
    }

    componentDidUpdate(prevProps) {
        if (this.props.pokemon !== prevProps.pokemon ||
            this.props.level !== prevProps.level) {
            this.updateStats(this.state.IVs, this.state.EVs,
                this.state.natureBuff, this.state.natureNerf);
        }
    }

    getBaseValues() {
        const base = pokemons[this.props.pokemon].base;
        return [base.hp, base.atk, base.def, base.spatk, base.spdef, base.spe];
    }

    updateStats(IVs, EVs, natureBuff, natureNerf) {
        const values = this.getBaseValues();
        let stats = [];
        for (let i = 0; i < 6; ++i) {
            const base = Math.floor(this.props.level * (values[i] * 2 + IVs[i] + EVs[i] / 4) / 100);
            if (i === 0) {
                stats.push(base + this.props.level + 10);
            } else {
                let nature = 1;
                if (natureBuff !== natureNerf) {
                    if (natureBuff === i) {
                        nature = 1.1;
                    }
                    if (natureNerf === i) {
                        nature = 0.9;
                    }
                }
                stats.push(Math.floor((base + 5) * nature));
            }
        }
        this.setState({
            IVs: IVs,
            EVs: EVs,
            natureBuff: natureBuff,
            natureNerf: natureNerf,
        });
        this.props.onStatsChange(stats);
    }

    handleIVChanges(idx, e) {
        let IVs = this.state.IVs;
        IVs[idx] = Number(e.target.value);
        this.updateStats(IVs, this.state.EVs, this.state.natureBuff, this.state.natureNerf);
    }

    handleEVChanges(idx, e, newValue) {
        let EVs = this.state.EVs;
        let sum = 0;
        for (let value of EVs) {
            sum += value;
        }
        sum -= EVs[idx];
        EVs[idx] = Math.min(newValue, 508 - sum);
        this.updateStats(this.state.IVs, EVs, this.state.natureBuff, this.state.natureNerf);
    }

    handleEVInputChanges(idx, e) {
        let EVs = this.state.EVs;
        let sum = 0;
        for (let value of EVs) {
            sum += value;
        }
        sum -= EVs[idx];
        EVs[idx] = Math.min(Number(e.target.value), 508 - sum);
        this.updateStats(this.state.IVs, EVs, this.state.natureBuff, this.state.natureNerf);
    }

    handleEVBlur() {
        let EVs = this.state.EVs;
        for (let i = 0; i < 6; ++i) {
            EVs[i] = Math.max(0, Math.min(252, EVs[i]));
            EVs[i] = Math.round(EVs[i] / 4) * 4;
        }
        this.updateStats(this.state.IVs, EVs, this.state.natureBuff, this.state.natureNerf);
    }

    render() {
        const values = this.getBaseValues();
        const texts = ["HP", "物攻", "物防", "特攻", "特防", "速度"];
        return (
            <Grid container direction="column">
                <Grid container direction="row">
                    <Grid item xs></Grid>
                    <Grid item xs>种族值</Grid>
                    <Grid item xs>个体值</Grid>
                    <Grid item xs>努力值({
                        510 - this.state.EVs.reduce((a, b) => a + b, 0)
                    })</Grid>
                    <Grid item xs></Grid>
                    <Grid item xs>性格修正</Grid>
                    <Grid item xs>能力</Grid>
                </Grid>
                {[0, 1, 2, 3, 4, 5].map((x) => (
                    <Grid container direction="row" key={x}>
                        <Grid item xs> {texts[x]}</Grid>
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
                                value={this.state.EVs[x]}
                                onChange={this.handleEVChanges.bind(this, x)}
                                step={4}
                                min={0}
                                max={252}
                            />
                        </Grid>
                        <Grid item xs>
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
                        <Grid item xs>
                            <Radio
                                checked={this.state.natureBuff === x}
                                onChange={() => {
                                    this.updateStats(this.state.IVs,
                                        this.state.EVs, x, this.state.natureNerf);
                                }}
                                value={x} />
                            <Radio
                                color='primary'
                                checked={this.state.natureNerf === x}
                                onChange={() => {
                                    this.updateStats(this.state.IVs,
                                        this.state.EVs, this.state.natureBuff, x);
                                }}
                                value={x} />
                        </Grid>
                        <Grid item xs>
                            {this.props.stats[x]}
                        </Grid>
                    </Grid>
                ))}
            </Grid>
        );
    }
}

export default StatusCalculator;