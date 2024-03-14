import { StyleSheet } from "react-native";

import { COLORS, SIZES } from "../../../constants";

const styles = StyleSheet.create({
  img:{
    height: "100%",
    width:"100%"
  },
  imgContainer:{
    width: 250,
    height: 250,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    borderWidth: 1,
    borderColor: COLORS.gray2,
  }

});

export default styles;
