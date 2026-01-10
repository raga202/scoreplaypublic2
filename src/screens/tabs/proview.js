import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import Svg, { Circle, Rect, Line } from 'react-native-svg';
import { Colors } from '../../constants/colors';

// Get the screen width so the field fits perfectly on any phone
const { width } = Dimensions.get('window');
const GROUND_SIZE = width - 40; 
const CENTER = GROUND_SIZE / 2;

export default function ProView() {
  return (
    <ScrollView style={styles.container}>
      
      <View style={styles.card}>
        <Text style={styles.header}>LIVE WAGON WHEEL</Text>
        <Text style={styles.subHeader}>V. Kohli (34 off 22)</Text>
        
        {/* THE VISUAL FIELD ENGINE */}
        <View style={styles.groundContainer}>
          <Svg height={GROUND_SIZE} width={GROUND_SIZE}>
            
            {/* 1. The Grass (Dark Green Circle) */}
            <Circle 
              cx={CENTER} 
              cy={CENTER} 
              r={CENTER - 5} 
              fill="#1a3300" 
              stroke={Colors.primary} 
              strokeWidth="2" 
            />
            
            {/* 2. The 30-Yard Circle (Dotted Line) */}
            <Circle 
              cx={CENTER} 
              cy={CENTER} 
              r={CENTER * 0.6} 
              fill="none" 
              stroke="#ffffff55" 
              strokeWidth="1" 
              strokeDasharray="4,4" 
            />
            
            {/* 3. The Pitch (Tan Rectangle in the middle) */}
            <Rect 
              x={CENTER - 6} 
              y={CENTER - 30} 
              width="12" 
              height="60" 
              fill="#d2b48c" 
            />

            {/* 4. USP: The Shot Lines (Wagon Wheel) */}
            {/* Shot: Cover Drive (Yellow) */}
            <Line 
              x1={CENTER} 
              y1={CENTER} 
              x2={CENTER - 80} 
              y2={CENTER - 60} 
              stroke="yellow" 
              strokeWidth="2" 
            />
            
            {/* Shot: Square Cut (White) */}
            <Line 
              x1={CENTER} 
              y1={CENTER} 
              x2={10} 
              y2={CENTER} 
              stroke="white" 
              strokeWidth="2" 
            />

          </Svg>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <Text style={{color: 'yellow'}}>● 4 Runs</Text>
          <Text style={{color: 'white', marginLeft: 20}}>● 1 Run</Text>
        </View>
      </View>

      {/* Prediction Zone */}
      <View style={styles.card}>
        <Text style={styles.header}>PREDICT NEXT BALL</Text>
        <View style={styles.predictRow}>
          <View style={styles.btn}><Text style={styles.btnText}>DOT</Text></View>
          <View style={styles.btn}><Text style={styles.btnText}>4</Text></View>
          <View style={styles.btn}><Text style={styles.btnText}>6</Text></View>
          <View style={styles.btn}><Text style={styles.btnText}>WICKET</Text></View>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  card: { margin: 15, padding: 15, backgroundColor: '#111', borderRadius: 12 },
  header: { color: Colors.primary, fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  subHeader: { color: '#ccc', fontSize: 14, marginBottom: 20 },
  groundContainer: { alignItems: 'center', justifyContent: 'center' },
  legend: { flexDirection: 'row', justifyContent: 'center', marginTop: 15 },
  predictRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  btn: { backgroundColor: '#333', padding: 15, borderRadius: 8, width: '22%', alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});