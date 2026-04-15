import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#020617",
  },

  title: {
    marginLeft: 20,
    marginTop: 20,
    fontSize: 25,
    color: "white",
  },

  /* HOME */
  homeContainer: {
    padding: 20,
    gap: 16,
  },

  /* TEAM */
  teamCard: {
    backgroundColor: "#1e1f23",
    borderRadius: 18,
    padding: 18,
    minHeight: 150,
  },

  /* ROW */
  homeRow: {
    flexDirection: "row",
    gap: 16,
  },

  /* CALENDAR */
  calendarCard: {
    flex: 1,
    backgroundColor: "#1e1f23",
    borderRadius: 18,
    padding: 16,
  },

  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  month: {
    color: "white",
    fontSize: 16,
  },

  /* FAVORITES */
  favoritesCard: {
    flex: 1,
    backgroundColor: "#1e1f23",
    borderRadius: 18,
    padding: 16,
  },

  favoritesContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardLabel: {
    color: "#9aa0a6",
    fontSize: 12,
    marginBottom: 6,
  },

  favTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  star: {
    fontSize: 22,
    color: "white",
  },

  /* SECTION */
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },

  sectionTitle: {
    color: "white",
    fontSize: 17,
    marginBottom: 10,
  },

  /* EMPTY */
  emptyCard: {
    alignItems: "center",
    marginTop: 30,
    opacity: 0.7,
  },

  emptyTitle: {
    color: "white",
    marginTop: 10,
  },

  icon: {
    fontSize: 40,
  },

  /* EVENT */
  eventCard: {
    backgroundColor: "#2a2a2a",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },

  date: {
    color: "#bbb",
    fontSize: 12,
  },

  eventTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  button: {
    backgroundColor: "#3a3a3a",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },

  buttonText: {
    color: "white",
  },

  /* MINI PLAYER */
  miniPlayer: {
    position: "absolute",
    bottom: 90,
    alignSelf: "center",
    width: "92%",
    height: 60,
    backgroundColor: "#191923",
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  /* NAVBAR */
  navbar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 90,
    backgroundColor: "#020617",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  /* HELPERS */
  row: {
    flexDirection: "row",
    gap: 10,
  },

  white: {
    color: "white",
  },

  gray: {
    color: "#aaa",
  }

});