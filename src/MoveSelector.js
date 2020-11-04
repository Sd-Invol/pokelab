import React from 'react';

import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import Tooltip from '@material-ui/core/Tooltip';
import ListItem from '@material-ui/core/ListItem';

import moves from './data/moves';
import types from './data/types';

class MoveSelector extends React.Component {
  constructor(props) {
    super(props);

    this.types_cn_to_en = {};
    for (let type in types) {
      this.types_cn_to_en[types[type].cn] = type;
    }
  }

  static get propTypes() {
    return {
      move: PropTypes.number,
      moveSet: PropTypes.array,
      onMoveChange: PropTypes.func
    };
  }

  handleChange(newMove) {
    this.props.onMoveChange(newMove);
  }

  render() {
    return (
      <List dense={true}>
        {this.props.moveSet.map(x => (
          <Tooltip title={moves[x].description} placement="right" arrow key={moves[x].id}>
            <ListItem button
              alignItems="center"
              onClick={() => this.handleChange(x)}
              selected={this.props.move === moves[x].id}>
              <img src={process.env.PUBLIC_URL + `/icons/${moves[x].class}.png`} alt={{ x }}
                style={{ height: "20px" }} />
              <img src={process.env.PUBLIC_URL + `/icons/types/${this.types_cn_to_en[moves[x].type].toLowerCase()}.svg`} alt={{ x }}
                style={{ height: "20px", marginRight: "2px" }} />
              <span>{moves[x].name.cn}({moves[x].power})</span>
            </ListItem>
          </Tooltip>))}
      </List>
    );
  }
}

export default MoveSelector;