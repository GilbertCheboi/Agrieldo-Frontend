import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: 10,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  farmName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  farmType: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  farmOwner: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  farmLocation: {
    fontSize: 13,
    color: '#999',
    marginTop: 3,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
