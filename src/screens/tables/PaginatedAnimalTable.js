import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const AnimalTable = ({animals}) => {
  const navigation = useNavigation();

  const TableHeader = () => (
    <View style={[styles.row, styles.header]}>
      <Text style={[styles.cell, styles.headerText]}>Name</Text>
      <Text style={[styles.cell, styles.headerText]}>Tag</Text>
      <Text style={[styles.cell, styles.headerText]}>Breed</Text>
      <Text style={[styles.cell, styles.headerText]}>Gender</Text>
      <Text style={[styles.cell, styles.headerText]}>Category</Text>
      <Text style={[styles.cell, styles.headerText]}>DOB</Text>
    </View>
  );

  const TableRow = ({item}) => (
    <TouchableOpacity
      style={styles.row}
      onPress={() =>
        navigation.navigate('AnimalProfile', {
          animal: item,
        })
      }>
      <Text style={styles.cell}>{item.name || '-'}</Text>
      <Text style={styles.cell}>{item.tag || '-'}</Text>
      <Text style={styles.cell}>{item.breed || '-'}</Text>
      <Text style={styles.cell}>{item.gender || '-'}</Text>
      <Text style={styles.cell}>{item.category || '-'}</Text>
      <Text style={styles.cell}>{item.dob || '-'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>
        Animals in this Farm{' '}
        <Text style={styles.caption}>(Tap an animal to view full profile)</Text>
      </Text>

      {/* Horizontal Scroll for wide tables */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>
          <TableHeader />

          <FlatList
            data={animals}
            keyExtractor={(item, index) =>
              item.id?.toString() || index.toString()
            }
            renderItem={TableRow}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 32,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingBottom: 10,
    color: '#1a3c34',
  },
  caption: {
    fontSize: 12,
    color: '#20d668',
    fontStyle: 'italic',
  },
  table: {
    minWidth: 800,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#f2f2f2',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  cell: {
    flex: 1,
    paddingHorizontal: 6,
    fontSize: 13,
    color: '#444',
  },
  emptyText: {
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
  },
});

export default AnimalTable;
