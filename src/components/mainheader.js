// src/components/mainheader.js
import React, { useContext, useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  Modal,
  SectionList,
  SafeAreaView,
  Dimensions,
  Image,
  Animated,
  Alert,
  BackHandler,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation as useNavHook } from '@react-navigation/native';
import { AuthContext } from '../context/authcontext';
import { PointsContext } from '../context/pointscontext';
import { navigate as rootNavigate, navigateNested as rootNavigateNested } from '../navigation/RootNavigation';

const { width: SCREEN_W } = Dimensions.get('window');
const ACCENT = '#A4D146';
const PANEL_WIDTH = Math.round(SCREEN_W * 0.90);

// Tabs defined in your tabnavigator.js
const TAB_SCREENS = new Set(['Home', 'Live', 'Scoreplay', 'News', 'Shorts']);

const MENU_SECTIONS = [
  {
    title: null,
    data: [
      { id: 'home', label: 'Home', icon: 'home-outline', route: 'Home' },
      { id: 'live', label: 'Live', icon: 'trophy-outline', route: 'Live' },
      { id: 'fixtures', label: 'Fixtures', icon: 'calendar-outline', route: 'Fixtures' },
      { id: 'results', label: 'Results', icon: 'checkmark-done-outline', route: 'Results' },
    ],
  },
  {
    title: 'Discover',
    data: [
      { id: 'news', label: 'News', icon: 'newspaper-outline', route: 'News' },
      { id: 'highlights', label: 'Highlights', icon: 'play-circle-outline', route: 'Highlights' },
      { id: 'stats', label: 'Stats & Leaders', icon: 'stats-chart-outline', route: 'Stats' },
      { id: 'tournaments', label: 'Tournaments', icon: 'trophy-outline', route: 'Tournaments' },
    ],
  },
  {
    title: 'My Stuff',
    data: [
      { id: 'myteams', label: 'My Teams', icon: 'heart-outline', route: 'MyTeams' },
      { id: 'myplayers', label: 'My Players', icon: 'people-outline', route: 'Onboarding' },
      { id: 'predictions', label: 'Predictions', icon: 'flash-outline', route: 'Predictions' },
      { id: 'leaderboard', label: 'Leaderboards', icon: 'podium-outline', route: 'Leaderboards' },
    ],
  },
  {
    title: 'More',
    data: [
      { id: 'settings', label: 'Settings', icon: 'settings-outline', route: 'Settings' },
      { id: 'privacy', label: 'Privacy', icon: 'lock-closed-outline', route: 'Privacy' },
      { id: 'help', label: 'Help & FAQ', icon: 'help-circle-outline', route: 'Help' },
      { id: 'feedback', label: 'Feedback', icon: 'chatbubble-ellipses-outline', route: 'Feedback' },
      { id: 'about', label: 'About', icon: 'information-circle-outline', route: 'About' },
    ],
  },
];

export default function MainHeader({ navigation: navigationProp, isProfileOpen, toggleProfile, unreadNotifications = 0, title = 'ScorePlay' }) {
  const navHook = useNavHook();
  const navigation = navigationProp || navHook;

  const { user } = useContext(AuthContext);
  const { points } = useContext(PointsContext);

  const [menuVisible, setMenuVisible] = useState(false);
  const translateX = useRef(new Animated.Value(-PANEL_WIDTH)).current;
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    if (!menuVisible) translateX.setValue(-PANEL_WIDTH);
  }, [menuVisible, translateX]);

  useEffect(() => {
    if (!menuVisible) return undefined;
    const onBack = () => { closeMenu(); return true; };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => {
      try {
        if (subscription && typeof subscription.remove === 'function') subscription.remove();
        else if (typeof BackHandler.removeEventListener === 'function') BackHandler.removeEventListener('hardwareBackPress', onBack);
      } catch (err) {
        console.warn('[MainHeader] error removing BackHandler listener', err);
      }
    };
  }, [menuVisible]);

  const openMenu = () => {
    setMenuVisible(true);
    requestAnimationFrame(() => {
      isAnimatingRef.current = true;
      Animated.timing(translateX, { toValue: 0, duration: 220, useNativeDriver: true }).start(() => { isAnimatingRef.current = false; });
    });
  };

  const closeMenu = () => {
    if (!menuVisible) return;
    isAnimatingRef.current = true;
    Animated.timing(translateX, { toValue: -PANEL_WIDTH, duration: 200, useNativeDriver: true }).start(() => {
      isAnimatingRef.current = false;
      setMenuVisible(false);
    });
  };

  const safeNavigate = (routeOrObj, paramsIn) => {
    let routeName = routeOrObj;
    let params = paramsIn;
    if (typeof routeOrObj === 'object' && routeOrObj !== null) {
      routeName = routeOrObj.name || routeOrObj.screen || routeOrObj.routeName;
      params = routeOrObj.params || paramsIn;
    }
    if (!routeName || typeof routeName !== 'string') {
      Alert.alert('Navigation error', 'Invalid route requested.');
      return false;
    }

    // If target is a tab — use rootNavigateNested for reliability
    if (TAB_SCREENS.has(routeName)) {
      try {
        rootNavigateNested('MainTabs', routeName, params);
        return true;
      } catch (err) {
        console.warn('[MainHeader] rootNavigateNested failed', err);
      }
    }

    // Non-tab: try local navigation
    try {
      if (navigation && typeof navigation.navigate === 'function') {
        navigation.navigate(routeName, params);
        return true;
      }
    } catch (err) {
      console.warn('[MainHeader] navigation.navigate failed', err);
    }

    // fallback root
    try {
      rootNavigate(routeName, params);
      return true;
    } catch (err) {
      console.warn('[MainHeader] rootNavigate failed', err);
    }

    Alert.alert('Navigation failed', `Could not navigate to ${routeName}`);
    return false;
  };

  const onMenuItemPress = (item) => {
    if (!item || !item.route) { Alert.alert('Navigation error', 'Menu item not configured.'); return; }
    closeMenu();
    setTimeout(() => safeNavigate(item.route, item.params), 240);
  };

  const onMenuProfilePress = () => { closeMenu(); setTimeout(() => safeNavigate('Profile'), 160); };

  const renderSectionHeader = ({ section: { title } }) => (title ? <Text style={styles.sectionHeader}>{title}</Text> : null);
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.menuRow} onPress={() => onMenuItemPress(item)} activeOpacity={0.85}>
      <View style={styles.menuLeft}><Ionicons name={item.icon} size={20} color="#fff" /></View>
      <Text style={styles.menuLabel}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <SafeAreaView style={styles.safeWrapper}>
        <StatusBar barStyle="light-content" backgroundColor="#111" />
        <View style={[styles.headerContainer, menuVisible ? styles.headerHidden : null]}>
          <View style={styles.left}><TouchableOpacity onPress={openMenu} style={styles.menuButton} activeOpacity={0.85}><Ionicons name="menu-outline" size={26} color="#fff" /></TouchableOpacity></View>
          <View style={styles.titleWrap}><Text numberOfLines={1} style={styles.title}>{title}</Text></View>
          <View style={styles.right}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => { setMenuVisible(false); setTimeout(() => safeNavigate('Notifications'), 120); }}><Ionicons name="notifications-outline" size={22} color="#FFF" />{unreadNotifications > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{unreadNotifications > 99 ? '99+' : unreadNotifications}</Text></View>}</TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => { setMenuVisible(false); setTimeout(() => safeNavigate('Search'), 120); }}><Ionicons name="search-outline" size={22} color="#FFF" /></TouchableOpacity>
            <TouchableOpacity onPress={() => { if (typeof toggleProfile === 'function') toggleProfile(); else safeNavigate('Profile'); }} style={styles.profileBtn}>{user?.avatarUrl ? <Image source={{ uri: user.avatarUrl }} style={styles.avatarImage} /> : <View style={[styles.avatarCircle, isProfileOpen && styles.activeProfile]}><Ionicons name="person" size={18} color="#000" /></View>}</TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <Modal visible={menuVisible} animationType="none" presentationStyle="overFullScreen" transparent onRequestClose={closeMenu}>
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.fullScreenSafe}>
            <Animated.View style={[styles.panel, { width: PANEL_WIDTH, transform: [{ translateX }] }]}>
              <TouchableOpacity style={styles.panelCloseRight} onPress={closeMenu} activeOpacity={0.85}><Ionicons name="close" size={20} color="#fff" /></TouchableOpacity>
              <View style={styles.panelHeader}>
                <View style={styles.panelProfileRow}>
                  {user?.avatarUrl ? <Image source={{ uri: user.avatarUrl }} style={styles.panelAvatarLarge} /> : <View style={[styles.panelAvatarPlaceholderLarge, { backgroundColor: ACCENT }]}><Ionicons name="person" size={30} color="#000" /></View>}
                  <View style={styles.panelProfileText}>
                    <Text style={styles.panelProfileName} numberOfLines={1}>{user?.name || user?.email || 'Guest User'}</Text>
                    <Text style={styles.pointsLabel}>{points !== undefined && points !== null ? `${points} TOTAL PTS` : '— TOTAL PTS'}</Text>
                    <TouchableOpacity onPress={onMenuProfilePress} activeOpacity={0.8}><Text style={styles.panelProfileLink}>View Profile</Text></TouchableOpacity>
                  </View>
                </View>
              </View>

              <SectionList sections={MENU_SECTIONS} keyExtractor={(item) => item.id} renderSectionHeader={renderSectionHeader} renderItem={renderItem} ItemSeparatorComponent={() => <View style={styles.sep} />} contentContainerStyle={styles.menuList} showsVerticalScrollIndicator={false} />

              <View style={styles.panelFooter}><Text style={styles.footerText}>ScorePlay • v1.0</Text></View>
            </Animated.View>
          </SafeAreaView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  // (styles identical to previous — omitted here for brevity; include the same styles as you already have)
  safeWrapper: { backgroundColor: '#111', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, borderBottomWidth: 1, borderBottomColor: '#222' },
  headerContainer: { height: 72, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
  headerHidden: { opacity: 0, pointerEvents: 'none' },
  left: { width: 56, justifyContent: 'center', alignItems: 'flex-start' },
  menuButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  titleWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { color: '#fff', fontSize: 20, fontWeight: '800' },
  right: { width: 140, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginLeft: 6 },
  profileBtn: { marginLeft: 8 },
  avatarCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: ACCENT, alignItems: 'center', justifyContent: 'center' },
  avatarImage: { width: 36, height: 36, borderRadius: 18 },
  activeProfile: { backgroundColor: '#111', borderWidth: 1, borderColor: '#333' },
  badge: { position: 'absolute', top: 6, right: 6, minWidth: 18, paddingHorizontal: 4, height: 18, borderRadius: 9, backgroundColor: ACCENT, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#000', fontSize: 10, fontWeight: '700' },
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#000' },
  fullScreenSafe: { flex: 1, backgroundColor: 'transparent' },
  panel: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: '#0d0d0d', paddingBottom: 12, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 6 }, android: { elevation: 8 } }) },
  panelCloseRight: { position: 'absolute', top: Platform.OS === 'android' ? (StatusBar.currentHeight ? StatusBar.currentHeight + 12 : 36) : 40, right: 12, zIndex: 40, backgroundColor: '#111', padding: 8, borderRadius: 20, borderWidth: 1, borderColor: '#222', alignItems: 'center', justifyContent: 'center' },
  panelHeader: { paddingTop: 56, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#222', marginBottom: 10, paddingHorizontal: 18 },
  panelProfileRow: { flexDirection: 'row', alignItems: 'center' },
  panelAvatarLarge: { width: 76, height: 76, borderRadius: 38, marginRight: 12 },
  panelAvatarPlaceholderLarge: { width: 76, height: 76, borderRadius: 38, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  panelProfileText: { flex: 1 },
  panelProfileName: { color: '#fff', fontSize: 18, fontWeight: '800' },
  pointsLabel: { color: ACCENT, fontSize: 12, fontWeight: '900', marginTop: 4 },
  panelProfileLink: { color: ACCENT, marginTop: 6, fontWeight: '700' },
  sectionHeader: { color: '#666', fontSize: 12, marginTop: 12, marginBottom: 6, marginHorizontal: 18, fontWeight: '700' },
  menuList: { paddingBottom: 24 },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 18 },
  menuLeft: { width: 36, alignItems: 'center' },
  menuLabel: { color: '#fff', fontSize: 16, marginLeft: 12 },
  sep: { height: 1, backgroundColor: '#222', marginVertical: 0 },
  panelFooter: { borderTopWidth: 1, borderTopColor: '#222', paddingTop: 10, alignItems: 'center', marginTop: 6 },
  footerText: { color: '#666', fontSize: 11 },
});