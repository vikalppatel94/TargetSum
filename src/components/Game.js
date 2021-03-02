import React from 'react';
import PropTypes from 'prop-types';

import { View, Text, StyleSheet } from 'react-native';

import RandomNumber from './RandomNumber';

class Game extends React.Component {
  static propTypes = {
    randomNumberCount: PropTypes.number.isRequired,
    initialSeconds: PropTypes.number.isRequired,
  };
  state = {
    selectedIds: [],
    remainingSeconds: 10,
  };
    randomNumbers = Array
      .from({ length: this.props.randomNumberCount })
      .map(() => 1 + Math.floor(10 * Math.random()))
    target = this.randomNumbers
      .slice(0, this.props.randomNumberCount - 2)
      .reduce((acc, curr) => acc + curr, 0);

    componentDidMount(){
      this.intervalID = setInterval(() => {
        this.setState((prevState) => {
          return { remainingSeconds: prevState.remainingSeconds - 1};
        });
      }, 1000);
    }

    componentWillUnmount(){
      clearInterval(this.intervalID);
    }

  isNumberSelected = (numberIndex) => {
    return this.state.selectedIds.indexOf(numberIndex) >= 0;
  };
  selectNumber = (numberIndex) => {
    this.setState((prevState) => ({
      selectedIds: [...prevState.selectedIds, numberIndex],
    }));
  };
  gameStatus = () => {
    const sumSelected = this.state.selectedIds.reduce((acc, curr) => {
      return acc + this.randomNumbers[curr];
    }, 0);
    if (sumSelected < this.target){
      return 'PLAYING';
    }
    if (sumSelected === this.target){
      return 'WON';
    }
    if (sumSelected > this.target){
      return 'LOST';
    }
  }
  render () {
    const gameStatus = this.gameStatus();
    return (
      <View style={styles.container}>
        <Text style={[styles.target, styles['STATUS_${gameStatus}']]}>
          {this.target}
        </Text>
        <View style={styles.randomContainer}>
        {this.randomNumbers.map((randomNumber, index) =>
          <RandomNumber
            key={index}
            id={index}
            number={randomNumber}
            isDisabled={this.isNumberSelected(index) || gameStatus !== 'PLAYING'}
            onPress={this.selectNumber}
          />
        )}
        </View>
        <Text>{gameStatus}</Text>
        <Text>{this.state.remainingSeconds}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddd',
    flex: 1,
    paddingTop: 30,
  },
  target: {
    fontSize: 50,
    backgroundColor: '#aaa',
    marginHorizontal: 50,
    textAlign: 'center',
  },
  randomContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  STATUS_PLAYING: {
    backgroundColor: '#bbb',
  },
  STATUS_WON: {
    backgroundColor: '#008000',
  },
  STATUS_LOST: {
    backgroundColor: '#FF0000',
  },
});

export default Game;
