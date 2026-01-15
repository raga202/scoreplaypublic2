import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '../constants/colors';
import { PointsContext } from '../context/pointscontext'; // CONNECT TO POINTS

const REWARDS_CATALOG = [
  { id: '1', title: 'Signed Kohli Jersey', cost: 5000, type: 'Physical' },
  { id: '2', title: 'IPL Final Ticket', cost: 12000, type: 'Ticket' },
  { id: '3', title: 'Digital Player Card (NFT)', cost: 500, type: 'Digital' },
  { id: '4', title: '20% Off Merch Code', cost: 250, type: 'Coupon' },
];

export default function RewardsScreen({ navigation }) {
  const { balance, spendPoints } = useContext(PointsContext);

  const handleRedeem = (item) => {
    Alert.alert(
      "Confirm Redemption",
      `Spend ${item.cost} points for ${item.title}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Redeem", 
          onPress: () => {
            const success = spendPoints(item.cost);
            if (success) {
                Alert.alert("Success!", "Check your email for redemption details.");
            } else {
                Alert.alert("Insufficient Points", "Play more games to earn points!");
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Real Balance Header */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>AVAILABLE BALANCE</Text>
        <Text style={styles.pointsLarge}>{balance} <Text style={{fontSize: 20, color: Colors.primary}}>PTS</Text></Text>
        <Text style={styles.subText}>Play 'Predict' to earn more</Text>
      </View>

      <FlatList
        data={REWARDS_CATALOG}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 15 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardInfo}>
               <Text style={styles.cardTitle}>{item.title}</Text>
               <Text style={styles.cardType}>{item.type}</Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.redeemBtn, { opacity: balance >= item.cost ? 1 : 0.3 }]}
              onPress={() => handleRedeem(item)}
              disabled={balance < item.cost}
            >
              <Text style={styles.costText}>{item.cost}</Text>
              <Text style={styles.ptsLabel}>PTS</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: '#1a1a1a',
    padding: 30,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    marginBottom: 10,
  },
  headerLabel: { color: '#888', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  pointsLarge: { color: '#FFF', fontSize: 48, fontWeight: 'bold', marginVertical: 5 },
  subText: { color: Colors.primary, fontSize: 14 },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#222'
  },
  cardInfo: { flex: 1 },
  cardTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  cardType: { color: '#666', fontSize: 12, textTransform: 'uppercase' },
  redeemBtn: {
    backgroundColor: '#222',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary
  },
  costText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  ptsLabel: { color: Colors.primary, fontSize: 10, fontWeight: 'bold' }
});