import { StyleSheet } from "react-native";

import { COLORS, FONT, SIZES } from "../../../constants";

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  userName: {
    fontFamily: FONT.regular,
    fontSize: SIZES.large,
    color: COLORS.secondary,
  },
  welcomeMessage: {
    fontFamily: FONT.bold,
    fontSize: SIZES.xLarge,
    color: COLORS.primary,
    marginTop: 2,
  },
  searchContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: SIZES.large,
    height: 50,
  },
  searchWrapper: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginRight: SIZES.small,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: SIZES.medium,
    height: "100%",
  },
  searchInput: {
    fontFamily: FONT.regular,
    width: "100%",
    height: "100%",
    paddingHorizontal: SIZES.medium,
    color: COLORS.secondary
  },
  searchBtn: {
    width: 50,
    height: "100%",
    backgroundColor: COLORS.tertiary,
    borderRadius: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBtnImage: {
    width: "50%",
    height: "50%",
    tintColor: COLORS.white,
  },
  tab: (active, item) => ({
    paddingVertical: SIZES.small / 2,
    paddingHorizontal: SIZES.small,
    borderRadius: SIZES.medium,
    borderWidth: 1,
    borderColor: active === item ? COLORS.primary : COLORS.gray,
    backgroundColor: active === item ? COLORS.gray2 : COLORS.lightWhite,
  }),
  tabText: (active, item) => ({
    fontFamily: FONT.medium,
    color: active === item ? COLORS.primary : COLORS.gray,
  }),

  sortFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    marginTop: SIZES.medium,
    width: "100%"
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: SIZES.large,
    borderRadius: SIZES.xSmall,
    paddingVertical: SIZES.small / 2,
    paddingHorizontal: SIZES.small,
    borderRadius: SIZES.medium,
    borderWidth: 1,
    width: '50%',
    height:"35%",
    maxHeight: '80%'
  },
  filterTop:{
    marginTop: SIZES.xSmall,
    marginBottom: SIZES.large,
    flexDirection:'row',
    justifyContent: "space-between"
  },
  modalTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    marginBottom: SIZES.xSmall,
  },
  filterTitle: {
    fontSize: SIZES.medium,
    fontFamily: FONT.medium,
    color: COLORS.primary,
  },
  filterOptionContainer: {
    flexDirection: 'row',
    paddingVertical: SIZES.xSmall,

  },
  filterOption: (item) => ({
    fontSize: SIZES.medium,
    fontFamily: FONT.medium,
    color: item !== ""? COLORS.secondary : COLORS.gray2,
    paddingEnd: SIZES.xSmall,
    minWidth: "20%"
  }),
  filterClose: {
    fontSize: SIZES.medium,
    fontFamily: FONT.medium,
    color: COLORS.crimson,
  }
});

export default styles;
