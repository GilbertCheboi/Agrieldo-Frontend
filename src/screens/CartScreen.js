import React, {useContext} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CartContext} from '../context/CartContext';

const CartScreen = ({navigation}) => {
  const {
    cartItems,
    increaseQty,
    decreaseQty,
    removeFromCart,
    getCartTotal,
    clearCart,
  } = useContext(CartContext);

  const total = Number(getCartTotal()).toLocaleString();

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={70} color="#ccc" />
        <Text style={styles.emptyText}>Your cart is empty</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#333" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Cart</Text>

        <View style={{width: 26}} />
      </View>

      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{paddingBottom: 140}}>
        {cartItems.map(item => (
          <View key={item.id} style={styles.itemCard}>
            {/* Product Image */}
            {item.image ? (
              <Image source={{uri: item.image}} style={styles.image} />
            ) : (
              <View style={styles.noImage}>
                <Ionicons name="image-outline" size={32} color="#aaa" />
              </View>
            )}

            {/* Product Info */}
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>

              <Text style={styles.itemType}>
                {item.type === 'feed' ? 'Feed Item' : 'Drug Item'}
              </Text>

              <Text style={styles.itemPrice}>KES {item.price}</Text>

              {/* Quantity Selector */}
              <View style={styles.quantityRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => {
                    if (item.quantity === 1) {
                      removeFromCart(item.id);
                    } else {
                      decreaseQty(item.id);
                    }
                  }}>
                  <Text style={styles.qtyText}>-</Text>
                </TouchableOpacity>

                <Text style={styles.qtyNumber}>{item.quantity}</Text>

                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => increaseQty(item.id)}>
                  <Text style={styles.qtyText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Remove Item */}
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() =>
                Alert.alert(
                  'Remove Item',
                  'Are you sure you want to remove this item?',
                  [
                    {text: 'Cancel', style: 'cancel'},
                    {
                      text: 'Remove',
                      style: 'destructive',
                      onPress: () => removeFromCart(item.id),
                    },
                  ],
                )
              }>
              <Ionicons name="trash-outline" size={22} color="red" />
            </TouchableOpacity>
          </View>
        ))}

        <View style={{height: 20}} />
      </ScrollView>

      {/* Footer Total + Checkout */}
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: KES {total}</Text>

        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => navigation.navigate('Checkout')}>
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.clearBtn} onPress={clearCart}>
          <Text style={styles.clearText}>Clear Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },

  /* EMPTY STATE */
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  emptyText: {
    fontSize: 18,
    marginTop: 15,
    color: '#555',
  },

  /* ITEM CARD */
  itemCard: {
    flexDirection: 'row',
    padding: 12,
    marginHorizontal: 12,
    marginVertical: 6,
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    alignItems: 'center',
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  noImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },

  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },

  itemType: {
    fontSize: 12,
    color: '#777',
    marginTop: 3,
  },

  itemPrice: {
    color: '#ffa500',
    marginTop: 5,
    fontWeight: '600',
    fontSize: 15,
  },

  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  qtyBtn: {
    width: 32,
    height: 32,
    backgroundColor: '#eee',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  qtyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },

  qtyNumber: {
    fontSize: 16,
    color: '#333',
    marginHorizontal: 10,
    fontWeight: '600',
  },

  removeBtn: {
    padding: 6,
  },

  /* FOOTER */
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },

  totalText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },

  checkoutBtn: {
    backgroundColor: '#ffa500',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },

  clearBtn: {
    paddingVertical: 10,
  },
  clearText: {
    textAlign: 'center',
    color: 'red',
    fontSize: 15,
    fontWeight: '600',
  },
});
