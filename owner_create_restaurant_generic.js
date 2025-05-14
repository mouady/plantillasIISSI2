import React, { useEffect, useState } from 'react'
import { Image, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import * as ExpoImagePicker from 'expo-image-picker'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as yup from 'yup'
import DropDownPicker from 'react-native-dropdown-picker'
import { create, getCategories } from '../../api/ApiEndpoints'
import InputItem from '../../components/InputItem'
import TextRegular from '../../components/TextRegular'
import * as GlobalStyles from '../../styles/GlobalStyles'
import defaultLogo from '../../../assets/defaultLogo.jpeg'
import defaultBackground from '../../../assets/defaultBackground.jpeg'
import { showMessage } from 'react-native-flash-message'
import { ErrorMessage, Formik } from 'formik'
import TextError from '../../components/TextError'

export default function CreateItemScreen ({ navigation }) {
  const [open, setOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [backendErrors, setBackendErrors] = useState()

  const initialValues = { 
    name: null, 
    description: null, 
    address: null, 
    postalCode: null, 
    url: null, 
    price: null, 
    email: null, 
    phone: null, 
    categoryId: null 
  }

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .max(255, 'Name too long')
      .required('Name is required'),
    address: yup
      .string()
      .max(255, 'Address too long')
      .required('Address is required'),
    postalCode: yup
      .string()
      .max(255, 'Postal code too long')
      .required('Postal code is required'),
    url: yup
      .string()
      .nullable()
      .url('Please enter a valid url'),
    price: yup
      .number()
      .positive('Please provide a valid price value')
      .required('Price value is required'),
    email: yup
      .string()
      .nullable()
      .email('Please enter a valid email'),
    phone: yup
      .string()
      .nullable()
      .max(255, 'Phone too long'),
    categoryId: yup
      .number()
      .positive()
      .integer()
      .required('Category is required')
  })

  useEffect(() => {
    async function fetchCategories() {
      try {
        const fetchedCategories = await getCategories()
        const fetchedCategoriesReshaped = fetchedCategories.map((e) => {
          return {
            label: e.name,
            value: e.id
          }
        })
        setCategories(fetchedCategoriesReshaped)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving categories. ${error}`,
          type: 'error',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ExpoImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!')
        }
      }
    })()
  }, [])

  const pickImage = async (onSuccess) => {
    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    })
    if (!result.canceled) {
      if (onSuccess) {
        onSuccess(result)
      }
    }
  }

  const createItem = async (values) => {
    setBackendErrors([])
    try {
      const createdItem = await create(values)
      showMessage({
        message: `Item ${createdItem.name} succesfully created`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
      navigation.navigate('ItemsScreen', { dirty: true })
    } catch (error) {
      console.log(error)
      setBackendErrors(error.errors)
    }
  }

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={createItem}>
      {({ handleSubmit, setFieldValue, values }) => (
        <ScrollView>
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: '60%' }}>
              <InputItem
                name='name'
                label='Name:'
              />
              <InputItem
                name='description'
                label='Description:'
              />
              <InputItem
                name='address'
                label='Address:'
              />
              <InputItem
                name='postalCode'
                label='Postal code:'
              />
              <InputItem
                name='url'
                label='Url:'
              />
              <InputItem
                name='price'
                label='Price:'
              />
              <InputItem
                name='email'
                label='Email:'
              />
              <InputItem
                name='phone'
                label='Phone:'
              />

              <DropDownPicker
                open={open}
                value={values.categoryId}
                items={categories}
                setOpen={setOpen}
                onSelectItem={item => {
                  setFieldValue('categoryId', item.value)
                }}
                setItems={setCategories}
                placeholder="Select the category"
                containerStyle={{ height: 40, marginTop: 20 }}
                style={{ backgroundColor: GlobalStyles.brandBackground }}
                dropDownStyle={{ backgroundColor: '#fafafa' }}
              />
              <ErrorMessage name={'categoryId'} render={msg => <TextError>{msg}</TextError>} />

              <Pressable onPress={() =>
                pickImage(
                  async result => {
                    await setFieldValue('mainImage', result)
                  }
                )
              }
                style={styles.imagePicker}
              >
                <TextRegular>Main Image: </TextRegular>
                <Image style={styles.image} source={values.mainImage ? { uri: values.mainImage.assets[0].uri } : defaultLogo} />
              </Pressable>

              <Pressable onPress={() =>
                pickImage(
                  async result => {
                    await setFieldValue('secondaryImage', result)
                  }
                )
              }
                style={styles.imagePicker}
              >
                <TextRegular>Secondary Image: </TextRegular>
                <Image style={styles.image} source={values.secondaryImage ? { uri: values.secondaryImage.assets[0].uri } : defaultBackground} />
              </Pressable>

              {backendErrors &&
                backendErrors.map((error, index) => <TextError key={index}>{error.param}-{error.msg}</TextError>)
              }

              <Pressable
                onPress={handleSubmit}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? GlobalStyles.brandSuccessTap
                      : GlobalStyles.brandSuccess
                  },
                  styles.button
                ]}>
                <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
                  <MaterialCommunityIcons name='content-save' color={'white'} size={20} />
                  <TextRegular textStyle={styles.text}>
                    Save
                  </TextRegular>
                </View>
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
    color: 'white',
    textAlign: 'center',
    marginLeft: 5
  },
  imagePicker: {
    height: 40,
    paddingLeft: 10,
    marginTop: 20,
    marginBottom: 80
  },
  image: {
    width: 100,
    height: 100,
    borderWidth: 1,
    alignSelf: 'center',
    marginTop: 5
  }
})