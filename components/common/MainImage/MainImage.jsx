import React from 'react'
import { View, Image } from 'react-native'
import { checkImgURL } from '../../../utils/index';
import styles from './mainImage.style'
import noImage from '../../../assets/images/noImage.png'; //log

const MainImage = ({ imgArt, imgStatic }) => {

  return (
    <View style={styles.imgContainer}>
      <Image source={checkImgURL(imgArt)
        ? { uri: imgArt }
        : checkImgURL(imgStatic)
          ? { uri: imgStatic }
          : noImage
      }
        resizeMode='contain'
        style={styles.img}
      />
    </View>
  )
}

export default MainImage

//bad format
{/* <Image source={{
  uri: checkImgURL(imgGif) ? imgStatic
    : checkImgURL(imgStatic) ? imgStatic
      : noImage
}}
  resizeMode='contain'
  style={styles.img}
/> */}