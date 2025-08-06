// File: src/styles/AccountScreenStyles.js

import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  nameAndStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  cameraTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flexShrink: 1,
  },

  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#d4edda',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },

  statusText: {
    color: '#155724',
    fontSize: 12,
    fontWeight: '600',
  },

  statusText: {
    color: '#155724',
    fontSize: 12,
    fontWeight: '600',
  },

  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  videoTextDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  lastUpdatedText: {
    fontStyle: 'italic',
    color: '#888',
    fontSize: 14,
    marginTop: 6,
    justifyContent: 'space-between',
  },

  cameraTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },

  videoFeed: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: '#d3d3d3',
  },
  videoText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsContainer: {
    marginBottom: 20,
    marginLeft: 10,
  },
  detailsText: {
    fontSize: 16,
    marginVertical: 5,
    color: '#555',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
  },

  button: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 5,
  },

  refreshButton: {
    backgroundColor: '#28a745', // green
  },

  settingsButton: {
    backgroundColor: '#ffa500', // blue
  },

  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default styles;
