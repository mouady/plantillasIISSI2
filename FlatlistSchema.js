/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, FlatList, Pressable, View } from 'react-native';

import { getAllItems, remove } from '../../api/APIEndpoints';

import ImageCard from '../../components/ImageCard';
import TextSemiBold from '../../components/TextSemibold';
import TextRegular from '../../components/TextRegular';
import DeleteModal from '../../components/DeleteModal';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as GlobalStyles from '../../styles/GlobalStyles';

import { AuthorizationContext } from '../../context/AuthorizationContext';

import { showMessage } from 'react-native-flash-message';

import defaultLogo from '../../../assets/defaultLogo.jpeg';

export default function ListScreen({ navigation, route }) {
  
  const [items, setItems] = useState([]);
  const [itemToBeDeleted, setItemToBeDeleted] = useState(null);
  
  
  const { loggedInUser } = useContext(AuthorizationContext);

  
  useEffect(() => {
    if (loggedInUser) {
      fetchItems();
    } else {
      setItems(null);
    }
  }, [loggedInUser, route]);

  
  const renderItem = ({ item }) => {
    return (
      <ImageCard
        imageUri={item.image ? { uri: process.env.API_BASE_URL + '/' + item.image } : defaultLogo}
        title={item.name}
        onPress={() => {
          navigation.navigate('DetailScreen', { id: item.id });
        }}
      >
        <TextRegular numberOfLines={2}>{item.description}</TextRegular>
        
        <View style={styles.actionButtonsContainer}>
          
          <Pressable
            onPress={() => navigation.navigate('RelatedScreen', { id: item.id })}
            style={({ pressed }) => [
              {
                backgroundColor: pressed
                  ? GlobalStyles.brandSecondaryTap
                  : GlobalStyles.brandSecondary
              },
              styles.actionButton
            ]}>
            <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
              <MaterialCommunityIcons name='icon1' color={'white'} size={20}/>
              <TextRegular textStyle={styles.text}>
                Action 1
              </TextRegular>
            </View>
          </Pressable>

          
          <Pressable
            onPress={() => navigation.navigate('EditScreen', { id: item.id })}
            style={({ pressed }) => [
              {
                backgroundColor: pressed
                  ? GlobalStyles.brandBlueTap
                  : GlobalStyles.brandBlue
              },
              styles.actionButton
            ]}>
            <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
              <MaterialCommunityIcons name='pencil' color={'white'} size={20}/>
              <TextRegular textStyle={styles.text}>
                Edit
              </TextRegular>
            </View>
          </Pressable>

        </View>
      </ImageCard>
    );
  };

  
  const renderEmptyList = () => {
    return (
      <TextRegular textStyle={styles.emptyList}>
        No items were retrieved. Are you logged in?
      </TextRegular>
    );
  };

  
  const renderHeader = () => {
    return (
      <>
      {loggedInUser &&
        <Pressable
          onPress={() => navigation.navigate('CreateScreen')}
          style={({ pressed }) => [
            {
              backgroundColor: pressed
                ? GlobalStyles.brandGreenTap
                : GlobalStyles.brandGreen
            },
            styles.button
          ]}>
          <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
            <MaterialCommunityIcons name='plus-circle' color={'white'} size={20}/>
            <TextRegular textStyle={styles.text}>
              Create new
            </TextRegular>
          </View>
        </Pressable>
      }
      </>
    );
  };

  
  const fetchItems = async () => {
    try {
      const fetchedItems = await getAllItems();
      setItems(fetchedItems);
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving items. ${error}`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      });
    }
  };

  
  const removeItem = async (item) => {
    try {
      await remove(item.id);
      await fetchItems();
      setItemToBeDeleted(null);
      showMessage({
        message: `Item ${item.name} successfully removed`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      });
    } catch (error) {
      console.log(error);
      setItemToBeDeleted(null);
      showMessage({
        message: `Item ${item.name} could not be removed.`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      });
    }
  };

  return (
    <>
    <FlatList
      style={styles.container}
      data={items}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={renderEmptyList}
    />
    <DeleteModal
      isVisible={itemToBeDeleted !== null}
      onCancel={() => setItemToBeDeleted(null)}
      onConfirm={() => removeItem(itemToBeDeleted)}>
        <TextRegular>Texto modal</TextRegular>
        <TextRegular>Texto modal</TextRegular>
    </DeleteModal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    borderRadius: 8,
    height: 40,
    marginTop: 12,
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    width: '80%'
  },
  actionButton: {
    borderRadius: 8,
    height: 40,
    marginTop: 12,
    margin: '1%',
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'column',
    width: '33%'
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    bottom: 5,
    position: 'absolute',
    width: '90%'
  },
  text: {
    fontSize: 16,
    color: 'white',
    alignSelf: 'center',
    marginLeft: 5
  },
  emptyList: {
    textAlign: 'center',
    padding: 50
  }
});
