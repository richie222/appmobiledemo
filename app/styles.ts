import { StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
 
const colorBlack = '#000000';
const colorWhite = '#FFFFFF';
const colorYellow = '#FFCC00';
const colorRed = '#e57373';
const colorGray = '#B0B0B0';

const styles = StyleSheet.create({
  colorBlack: {
    color: colorBlack,
  },
  colorWhite: {
    color: colorWhite,
  },
  buttonContainerHome: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
    backgroundColor: 'black',
  },

  /*
style={{
        backgroundColor: 'black',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
      }}
  */
  buttonHome: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonGreen: {
    backgroundColor: colorYellow,
  },
  buttonRed: {
    backgroundColor: colorRed,
  },
  buttonGray: {
    backgroundColor: colorGray,
  },
  buttonText: {
    color: colorWhite,
    fontWeight: 'bold',
    fontSize: 16,
  },
  containerIndex: {
    paddingTop: 100,
    paddingBottom: 20,
    flex: 1,
    alignItems: 'center',
    backgroundColor: colorBlack,
    padding: 24,
  },
  container: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: colorBlack,
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
    color: colorWhite,
  },
  //login.tsx
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: colorGray
  },
  required: {
    color: colorRed,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: '#bdbdbd',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  requiredNote: {
    marginTop: 18,
    color: '#e53935',
    fontSize: 13,
    textAlign: 'right',
  },
  inputGroup: {
    marginBottom: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    fontStyle: 'italic',
  },

  //REGISTERBATTER
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  passwordInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    fontStyle: 'italic',
  },
  eyeIcon: {
    padding: 10,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },

//newseacon
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#FFCC00',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderRadius: 8,
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    color: '#FFFFFF',
    backgroundColor: '#FFCC00'
  },
  dataRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dataCell: {
    fontSize: 14,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  editButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },

  //registerGame
  content: {
    padding: 20,
    paddingTop: 40,
  },
  seasonSelector: {
    marginBottom: 20,
    zIndex: 3000, 
    width: '100%',
  },
  dropdownContainer: {
    zIndex: 3000,
  },
  dropdown: {
    backgroundColor: '#f9f9f9',
    //borderColor: '#ddd',
    borderRadius: 8,
  },
  dropdownList: {
    backgroundColor: '#f9f9f9',
    //borderColor: '#ddd',
  },
  dropdownItem: {
    color: '#333',
  },
  dropdownPlaceholder: {
    color: '#999',
  },
  gamesContainer: {
    marginTop: 20,
    zIndex: 1, // Menor que el dropdown para que no interfiera
  },
  seasonInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  seasonInfo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colorWhite,
  },
  gamesList: {
    marginTop: 10,
  },
  newGameButton: {
    marginTop: 10,
    width: '100%',
  },
    dataContainer: {
    width: '80%',
    backgroundColor: '#f1f8e9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  dataTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
  },
  dataText: {
    fontSize: 15,
    marginBottom: 2,
  },
  tableContainer: {
    width: '100%',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    paddingBottom: 10,
    
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 2,
    alignItems: 'center',
  },
  /*headerRow: {
    backgroundColor: '#4caf50',
  },
  headerCell: {
    color: '#fff',
    fontWeight: 'bold',
  },*/
  rowEven: {
    backgroundColor: '#f1f8e9',
  },
  rowOdd: {
    backgroundColor: '#fff',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
  },
  valueText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colorWhite,
  },
    counterButton: {
        backgroundColor: colorBlack,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 6,
        marginHorizontal: 8,
    },
    statsContainer: {
        marginTop: 20,
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#fff9c4', 
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    scrollContainer: {
        flexGrow: 1,
    },
    inputContainer: {
        marginBottom: 20,
    },
     statsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    counterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        justifyContent: 'space-between',
    },
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    counterButtonText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    counterValue: {
        fontSize: 20,
        minWidth: 30,
        textAlign: 'center',
    },
  formGroup: {
    marginBottom: 20,
  },
  winContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  winStatus: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  winNote: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
  },
});

export default styles;