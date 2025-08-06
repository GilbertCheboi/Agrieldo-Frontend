import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#292b7eff',
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffa500',
  },

  smallButton: {
    backgroundColor: '#51cc53',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 5,
  },

  smallButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  feedVsMilkCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },

  chartWrapper: {
    marginTop: 12,
    overflow: 'hidden',
    width: '103%',
    alignItems: 'center',
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  value: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  subText: {
    fontSize: 14,
    color: '#555',
  },
});

export default styles;
