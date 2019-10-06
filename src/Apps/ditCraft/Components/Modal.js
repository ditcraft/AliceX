import React from 'react';
import {
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  Modal,
  View,
  Dimensions
} from 'react-native';
import t from 'prop-types';

const { height, width } = Dimensions.get('window');

class MyModal extends React.Component {
  static propTypes = {
    children: t.node.isRequired,
    visible: t.bool.isRequired,
    dismiss: t.func.isRequired,
    transparent: t.bool,
    animationType: t.string,
  };

  static defaultProps = {
    animationType: 'fade',
    transparent: true,
  };

  render() {
    const { props } = this;
    return (
      <View>
        <Modal style = {{  margin: 0 }}
          visible={props.visible}
          transparent={props.transparent}
          onRequestClose={props.dismiss}
          animationType={props.animationType}
          onBackdropPress={props.dismiss}
          >
          <View style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 0}}>
            <TouchableWithoutFeedback onPress={props.dismiss}>
              <View style={styles.modalOverlay} />
            </TouchableWithoutFeedback>
            <View style={{
                  width: 400,
                  height: 250}}>
            <View style={styles.modalContent}>
              {props.children}
            </View>
          </View>
        </View>
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    margin: '7%',
    backgroundColor: '#2f3f6d',
    color: 'white',
    borderRadius: 10
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
});


export default MyModal;
