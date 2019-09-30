import React, { Component } from 'react';
import { FlatList, StyleSheet, ActivityIndicator, Text, View, Dimensions, AsyncStorage, TouchableOpacity, TouchableWithoutFeedback, Button, Image, ScrollView } from 'react-native';
import ModalComponent from './Components/Modal.js';
var sampledata = require('./Assets/sampledata.json');
import env from '../../../env.json';
import moment from 'moment';
import {Contract} from "../../AliceSDK/Web3";
import {ditCoordinatorABI} from "./ABI";
/*import './shim.js'
import {crypto} from 'crypto'
import {ethers} from 'ethers'*/

const { height, width } = Dimensions.get('window');

export default class ditCraft extends Component {
	constructor(props){
		super(props);
		this.state = {
			isLoading: true,
			isModalVisible: false,
			selectedItem: null,
      		dataSource: []
		}
	}

	componentDidMount(){
		return fetch('https://server.ditcraft.io/api/proposal', {
			method: 'POST',
			headers: {
			  Accept: 'application/json',
			  'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				api_key: env.ditcraft,
				mode: 'demo',
				amount: 25
			})
		})
		.then((response) => response.json())
		.then((responseJson) => {
			console.log('responseJson: ', responseJson);
			this.setState({
			isLoading: false,
			dataSource: responseJson,
			}, function(){

			});

		})
		.catch((error) =>{
			console.error(error);
		});
	}

	showModal = () => this.setState({ isModalVisible: true });
	hideModal = () => this.setState({ isModalVisible: false });

	actionOnRow(item) {
		console.log('Selected Item :',item);
		this.setState({ selectedItem: item });
		this.showModal();
	}

	voteUp = async () => {
		try {
			//generate rand
			// Create vote Hash
			/*let choice = 0; // 0 = deny, 1 = accept
			//let seed = crypto.randomBytes(32); // Needs to be stored! 
			// (Maybe convert to string before storing since decimals would overflow. Maybe we ca use this: https://www.npmjs.com/package/biguint-format)

			let voteHash = ethers.utils.solidityKeccak256([ 'uint256', 'uint256' ], [ choice, seed ]);

			let repoHash = "0xc6bca7502e6d32e5354c70c5d918324ecaa19e2c93417c810d19fc28c7f2403f"

			let proposalID = 0 // Depending on the proposal that we vote on

			let numberOfKNW = 0 // We can test with 0 for now, we could retrieve the current free balance in the future and use that

			// Function "voteOnProposal" needs to be called with these values (in that order): repoHash, proposalID, voteHash, numberOfKNW
			*/
			await AsyncStorage.setItem('@ditCraft:key', 'I like to save it.');
		
			const txHash = await Contract.write({
				contractAddress: '0x9A65c773A216a4F4748B1D65C0fB039d9F2b223D',
				abi: ditCoordinatorABI,
				functionName: 'voteOnProposal',
				parameters: ['', '', '']
			});
		
			console.log('txHash: ', txHash);
		} catch(e) {
		  console.log('error: ', e)
		}
	};
	
	voteDown = () => {

	};

	render() {

		if(this.state.isLoading){
			return(
			  <View style={{flex: 1, padding: 20}}>
				<ActivityIndicator/>
			  </View>
			);
		}

		let modalInfo;
		if(this.state.selectedItem){
			modalInfo = <View style={{padding: 10}}>
					<Text style={{color: '#fff'}}>
						<Text style={{fontWeight: 'bold', color: '#fff'}}>[#{this.state.selectedItem.knw_vote_id}] </Text>
						<Text>{this.state.selectedItem.topic}</Text>
					</Text>
					<Text style={{color: '#fff'}}>
						<Text>Over at </Text>
						<Text style={{fontWeight: 'bold'}}>{moment(this.state.selectedItem.reveal_phase_end).format('HH:mm:ss DD.MM.YYYY')}</Text>
					</Text>
					<View style={{flexDirection: 'row',}}>
						<TouchableOpacity onPress={this.voteUp}>
							<Image source={require('./Assets/Icons/arrow-up-bold-box-outline.png')}/>
						</TouchableOpacity>
						<TouchableOpacity onPress={this.voteDown} style={{position: 'absolute', right: 0}}>
							<Image source={require('./Assets/Icons/arrow-down-bold-box-outline.png')}/>
						</TouchableOpacity>
					</View>
				</View>
		} else {
			modalInfo = <Text>No information</Text>
		}
		return (

			<View style={styles.container}>
				<View style={styles.itemContainer}>
					<Image style={styles.img}
						source={require('./Assets/logo.png')}  
						style={{width: 75, height: 75, borderRadius: 75/ 2}} 
					/>
				</View>
				<ScrollView>
					<FlatList
						data={this.state.dataSource}
						renderItem={({item}) =>
						<View style={styles.item2}>
							<TouchableWithoutFeedback onPress={ () => this.actionOnRow(item)}>
								<Text style={styles.item}>
									<Image source={item.accepted ? require('./Assets/Icons/check.png') : require('./Assets/Icons/close.png')} style={styles.buttonIcon}/>
									<Text style={{color: '#2f3f6d', fontWeight: 'bold'}}>[#{item.knw_vote_id}] </Text>
									<Text>{item.topic}</Text>
								</Text>
							</TouchableWithoutFeedback>
						</View>

						}
						/*keyExtractor={({id}, index) => id}*//>
				</ScrollView>
				<ModalComponent
					visible={this.state.isModalVisible}
					dismiss={this.hideModal}>
					{modalInfo}
				</ModalComponent>
			</View>
		);
	}
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22,
   backgroundColor: '#f2f8f9'
  },
  item: {
    padding: 10,
    fontSize: 18,
	height: 44,
	marginBottom: 10,
	justifyContent: 'center'
  },
  modal: {
    margin: 0,
  },
  itemContainer: {
	justifyContent: 'center',
	alignItems:'center',
	height:130
  },
  img:{
	flex: 1,
	height: 100,
	width: 100,
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'center'
  },
  buttonIcon: {
    resizeMode: 'contain',
    width: 50,
    height: 50
  },
  item2: {
	backgroundColor: '#fff',
	marginBottom: 10,
	marginLeft: 10,
	marginRight: 10,
	borderRadius: 10
  }
})
