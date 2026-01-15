import React, { useState, useRef, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  Animated, 
  PanResponder, 
  TouchableOpacity 
} from 'react-native';
import { Colors } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { PointsContext } from '../context/pointscontext'; // CONNECT TO POINTS

const { width, height } = Dimensions.get('window');

const QUESTIONS = [
  { id: 1, text: "WILL KOHLI HIT A 6 NEXT OVER?", bg: '#0f2027' },
  { id: 2, text: "WICKET IN THE NEXT 10 BALLS?", bg: '#203a43' },
  { id: 3, text: "INDIA TO WIN BY 20 RUNS?", bg: '#2c5364' },
  { id: 4, text: "SUPER OVER TODAY?", bg: '#4b134f' },
];

export default function PredictGame({ navigation }) {
  const { addPoints } = useContext(PointsContext); // Use Context
  const [currentIndex, setCurrentIndex] = useState(0);

  // Animation Values
  const position = useRef(new Animated.ValueXY()).current;

  // 1. Configure Gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      
      onPanResponderMove: (_, gestureState) => {
        position.setValue({ x: gestureState.dx, y: gestureState.dy });
      },

      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 120) { // Swiped Right (YES)
          Animated.spring(position, {
            toValue: { x: width + 100, y: gestureState.dy },
            useNativeDriver: false,
          }).start(() => nextCard());
        } else if (gestureState.dx < -120) { // Swiped Left (NO)
          Animated.spring(position, {
            toValue: { x: -width - 100, y: gestureState.dy },
            useNativeDriver: false,
          }).start(() => nextCard());
        } else {
          Animated.spring(position, { // Snap Back
            toValue: { x: 0, y: 0 },
            friction: 4,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const nextCard = () => {
    // Check if game is over
    if (currentIndex >= QUESTIONS.length - 1) {
       addPoints(50); // AWARD POINTS
    }
    
    position.setValue({ x: 0, y: 0 });
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  // 2. Interpolation (Card Rotation)
  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const rotateAndTranslate = {
    transform: [{ rotate: rotate }, ...position.getTranslateTransform()],
  };

  const likeOpacity = position.x.interpolate({
    inputRange: [0, width / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-width / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // 3. Render
  const renderCards = () => {
    if (currentIndex >= QUESTIONS.length) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="trophy" size={80} color={Colors.primary} />
          <Text style={styles.emptyText}>ALL PREDICTIONS DONE!</Text>
          <Text style={{color: Colors.primary, marginTop: 10, fontSize: 18, fontWeight: 'bold'}}>+50 Coins Earned</Text>
          
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.finishBtn}>
            <Text style={styles.finishBtnText}>RETURN TO MATCH</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return QUESTIONS.map((item, i) => {
      if (i < currentIndex) return null;

      if (i === currentIndex) {
        return (
          <Animated.View
            {...panResponder.panHandlers}
            key={item.id}
            style={[rotateAndTranslate, styles.card, { backgroundColor: item.bg, zIndex: 1 }]}
          >
            <Animated.View style={[styles.choiceOverlay, { right: 40, top: 50, opacity: nopeOpacity, borderColor: '#ff4444' }]}>
               <Text style={[styles.choiceText, { color: '#ff4444' }]}>NOPE</Text>
            </Animated.View>

            <Animated.View style={[styles.choiceOverlay, { left: 40, top: 50, opacity: likeOpacity, borderColor: '#00f5d4' }]}>
               <Text style={[styles.choiceText, { color: '#00f5d4' }]}>YES</Text>
            </Animated.View>

            <Text style={styles.question}>{item.text}</Text>
            
            <View style={styles.footer}>
                <Ionicons name="hand-left-outline" size={24} color="#ffffff55" />
                <Text style={styles.footerText}>DRAG TO VOTE</Text>
            </View>
          </Animated.View>
        );
      } else {
        return (
          <Animated.View
            key={item.id}
            style={[styles.card, { backgroundColor: item.bg, top: 10 * (i - currentIndex), zIndex: -i }]}
          >
             <Text style={styles.question}>{item.text}</Text>
          </Animated.View>
        );
      }
    }).reverse();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
         <Text style={styles.header}>RAPID PREDICT</Text>
         <View style={styles.coinBadge}>
            <Text style={styles.coinText}>WIN 50 PTS</Text>
         </View>
      </View>
      
      <View style={styles.cardContainer}>
        {renderCards()}
      </View>
      
      <Text style={styles.instruction}>Swipe Right for YES • Swipe Left for NO</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', paddingTop: 60 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 10 },
  header: { color: '#fff', fontSize: 20, fontWeight: '900', fontStyle: 'italic', letterSpacing: 1 },
  coinBadge: { backgroundColor: '#222', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: Colors.primary },
  coinText: { color: Colors.primary, fontWeight: 'bold', fontSize: 12 },
  cardContainer: { flex: 1, alignItems: 'center', marginTop: 20 },
  card: {
    height: height * 0.6, width: width * 0.9, borderRadius: 20, padding: 30, justifyContent: 'center', alignItems: 'center',
    position: 'absolute', shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5,
    borderWidth: 1, borderColor: '#ffffff22'
  },
  question: { color: '#fff', fontSize: 36, fontWeight: '900', textAlign: 'left', lineHeight: 45 },
  footer: { position: 'absolute', bottom: 30, alignItems: 'center' },
  footerText: { color: '#ffffff55', fontSize: 10, fontWeight: 'bold', marginTop: 5, letterSpacing: 2 },
  choiceOverlay: { position: 'absolute', borderWidth: 4, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, transform: [{ rotate: '-15deg' }] },
  choiceText: { fontSize: 32, fontWeight: '900', letterSpacing: 2 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 20 },
  finishBtn: { marginTop: 30, backgroundColor: Colors.primary, paddingHorizontal: 30, paddingVertical: 15, borderRadius: 30 },
  finishBtnText: { fontWeight: 'bold', fontSize: 16 },
  instruction: { textAlign: 'center', color: '#666', marginBottom: 40, fontSize: 12 }
});