/* eslint-disable no-use-before-define */
/* eslint-disable react/prop-types */
/* eslint-disable global-require */
/* eslint-disable no-console */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import makeBlockie from 'ethereum-blockies-base64';

import { Countdown, Proposer, ContributionReward, VoteBreakdown } from './'
import { Settings } from '../../../AliceSDK/Web3';

const { height, width } = Dimensions.get('window');

export default class DAOstackApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      daos: [],
    };
  }

  newProposal = () => {
    const options = {};
    ReactNativeHapticFeedback.trigger('selection', options);
    this.props.navigation.navigate('NewProposal');
  };

  render() {
    const { proposal, key, proposer } = this.props;
    const gravatar = makeBlockie(proposal.proposer)
    return (
      <View
        key={key}
        onPress={() => this.props.navigation.navigate('DAOstackHome')}
        style={styles.daoBox}
      >
        <View
          style={{ width: '100%', padding: 15, borderTopLeftRadius: 15, borderTopRightRadius: 15 }}
        >
          <Countdown style={{ marginBottom: 7 }} timeTillDate={proposal.closingAt} />
          <View style={{ flexDirection: 'row', marginBottom: 14 }}>
            <Image style={{width: 15, height: 15, marginRight: 5 }} source={{uri: gravatar}}/>
            <Proposer name={proposer ? proposer.name : null} proposal={proposal}/>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: width - 70,
              marginBottom: 10,
            }}
          >
            <Text numberOfLines={1} style={{ fontWeight: '700' }}>
              {proposal.title}
            </Text>
            <TouchableOpacity onPress={() => Settings.openBrowser(proposal.url)}>
              <Image
                source={require('../Assets/link-icon.png')}
                style={{
                  height: 10,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
              borderRadius: 7,
              borderWidth: 1,
              borderColor: '#c0c0c0',
              width: width - 70,
            }}
          >
            <ContributionReward proposal={proposal}/>
          </View>
        </View>
        <VoteBreakdown totalRepWhenCreated={proposal.totalRepWhenCreated} votesFor={proposal.votesFor} votesAgainst={proposal.votesAgainst} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  daoBox: {
    width: width - 20,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },
});
