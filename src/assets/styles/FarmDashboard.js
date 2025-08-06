// File: src/screens/FarmDashboard.styles.js

import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  farmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 16,
  },
  farmText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  unsupportedBox: {
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff8f0',
    borderColor: '#ffa500',
    borderWidth: 1,
  },
  unsupportedText: {
    fontSize: 16,
    color: '#92400e',
    textAlign: 'center',
  },
});
