import { React } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import TextRegular from './TextRegular'
import * as GlobalStyles from '../styles/GlobalStyles'
import TextSemiBold from './TextSemibold'
export default function AmountSelector (props) {
  const { amount, onIncrease, onDecrease, onDeleteProduct } = props

  const increment = () => {
    if (onIncrease) {
      onIncrease()
    }
  }

  const decrement = () => {
    if (amount > 0 && onDecrease) {
      onDecrease()
    }
  }

  // TODO: Not showing (-) or making it disabled if the amount is 0
  return (
    <View style={styles.container}>

        {amount > 0 &&
        <Pressable
          onPress={decrement}
          style={({ pressed }) => [
            {
              backgroundColor: pressed
                ? GlobalStyles.brandSecondaryTap
                : GlobalStyles.brandSecondary
            },
            styles.button
          ]}>
            <TextSemiBold textStyle={styles.textButton}>-</TextSemiBold>
        </Pressable>}
        {amount > 0 &&
        <TextRegular style={{ marginHorizontal: 10 }}>{amount}</TextRegular>
        }
        <Pressable
          onPress={increment}
          style={({ pressed }) => [
            {
              backgroundColor: pressed
                ? GlobalStyles.brandSecondaryTap
                : GlobalStyles.brandSecondary
            },
            styles.button
          ]}>
            <TextSemiBold textStyle={styles.textButton}>+</TextSemiBold>
        </Pressable>

        {amount > 0 &&
        <Pressable
          onPress={onDeleteProduct}
          style={({ pressed }) => [
            {
              backgroundColor: pressed
                ? GlobalStyles.brandPrimaryTap
                : GlobalStyles.brandPrimary
            },
            styles.button
          ]}>
              <TextRegular textStyle={styles.text}>Delete</TextRegular>
            </Pressable>
        }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  button: {
    borderRadius: 8,
    height: 40,
    margin: 5,
    padding: 10,
    minWidth: 40
  },
  text: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center'
  },
  textButton: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center'
  }
})
