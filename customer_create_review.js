import { React, useState, useContext } from 'react'
import { View, ScrollView, StyleSheet, Pressable } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import InputItem from '../../components/InputItem'
import DropDownPicker from 'react-native-dropdown-picker'
import TextRegular from '../../components/TextRegular'
import TextError from '../../components/TextError'
import * as GlobalStyles from '../../styles/GlobalStyles'
import { postReview } from '../../api/RestaurantEndpoints'
import { Formik } from 'formik'
import * as yup from 'yup'
import { AuthorizationContext } from '../../context/AuthorizationContext'

export default function CreateReviewScreen ({ navigation, route }) {
  const { loggedInUser } = useContext(AuthorizationContext)
  const initialReviewValues = { stars: null, body: null, restaurantId: route.params.id, customerId: loggedInUser.id }
  const [backendErrors, setBackendErrors] = useState()
  // validacion
  const validationSchema = yup.object().shape({
    body: yup
      .string()
      .max(255, 'Name too long')
      .optional()
  })

  // DropDownPicker de las estrellas
  const [open, setOpen] = useState(false)
  const [restaurantStars, setRestaurantStars] = useState([
    { value: 0, label: 0 },
    { value: 1, label: 1 },
    { value: 2, label: 2 },
    { value: 3, label: 3 },
    { value: 4, label: 4 },
    { value: 5, label: 5 }])

  const handleOnPress = async (values) => {
    try {
      await postReview(route.params.id, values)
      navigation.navigate('ReviewsScreen', { dirty: false })
      showMessage({
        message: 'Review creada con exito',
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    } catch (error) {
      setBackendErrors(error.errors)
    }
  }
  return (
     <Formik
     validationSchema={validationSchema}
     initialValues={initialReviewValues}
     >
        {({ setFieldValue, values }) => (
        <ScrollView>
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: '60%' }}>
              <InputItem
                name='body'
                label='Review:'
                placeholder='Describe your feelings about this restaurant'
              />
              <DropDownPicker
                open={open}
                value={values.stars}
                items={restaurantStars}
                setOpen={setOpen}
                onSelectItem={ item => {
                  setFieldValue('stars', item.value)
                }}
                setItems={setRestaurantStars}
                placeholder="Select the stars"
                containerStyle={{ height: 40, marginTop: 20 }}
                style={{ backgroundColor: GlobalStyles.brandBackground }}
                dropDownStyle={{ backgroundColor: '#fafafa' }}
              />
              <Pressable
                onPress={() => handleOnPress(values)}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? GlobalStyles.brandPrimaryTap
                      : GlobalStyles.brandPrimary
                  },
                  styles.button
                ]}>
                    { backendErrors &&
        backendErrors.map((error, index) => <TextError key={index}>{error.msg}</TextError>)
   }
                <TextRegular textStyle={styles.text}>
                Create review
                </TextRegular>
              </Pressable>
            </View>
          </View>
        </ScrollView>
        )}
     </Formik>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    height: 40,
    padding: 10,
    width: '100%',
    marginTop: 20,
    marginBottom: 20
  },
  text: {
    fontSize: 16,
    color: 'rgb(255, 255, 255)',
    textAlign: 'center'
  }
})
