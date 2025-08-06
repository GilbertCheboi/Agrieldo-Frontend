import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const ROWS_PER_PAGE = 5;

const PaginatedAnimalTable = ({animals}) => {
  const navigation = useNavigation();

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(animals.length / ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const currentAnimals = animals.slice(startIndex, startIndex + ROWS_PER_PAGE);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

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
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.tag}</Text>
      <Text style={styles.cell}>{item.breed}</Text>
      <Text style={styles.cell}>{item.gender}</Text>
      <Text style={styles.cell}>{item.category}</Text>
      <Text style={styles.cell}>{item.dob}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>
        Animals in this Farm{' '}
        <Text style={styles.caption}>(Click animal to view full profile)</Text>
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>
          <TableHeader />
          <FlatList
            data={currentAnimals}
            keyExtractor={(item, index) =>
              item.id?.toString() || index.toString()
            }
            renderItem={TableRow}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
      <View style={styles.pagination}>
        <TouchableOpacity onPress={handlePrev} disabled={currentPage === 1}>
          <Text
            style={[styles.pageButton, currentPage === 1 && styles.disabled]}>
            Prev
          </Text>
        </TouchableOpacity>
        <Text style={styles.pageIndicator}>
          Page {currentPage} of {totalPages}
        </Text>
        <TouchableOpacity
          onPress={handleNext}
          disabled={currentPage === totalPages}>
          <Text
            style={[
              styles.pageButton,
              currentPage === totalPages && styles.disabled,
            ]}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 24,
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
  caption: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    color: '#20d668',
  },
  cell: {
    flex: 1,
    paddingHorizontal: 6,
    fontSize: 13,
    color: '#444',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    alignItems: 'center',
  },
  pageButton: {
    color: '#ffa500',
    fontWeight: '600',
    fontSize: 14,
  },
  disabled: {
    color: '#ccc',
  },
  pageIndicator: {
    fontSize: 13,
    color: '#333',
  },
});

export default PaginatedAnimalTable;
