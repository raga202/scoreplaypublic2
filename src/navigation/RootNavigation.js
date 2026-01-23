import { createNavigationContainerRef, CommonActions } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

const pending = [];

/**
 * Flush queued actions when the ref is ready.
 * Each pending entry is { type: 'navigate'|'nested', name, params, screen? }.
 */
function flushPending() {
  if (!navigationRef.isReady()) return;
  while (pending.length) {
    const entry = pending.shift();
    try {
      if (entry.type === 'nested') {
        navigationRef.dispatch(
          CommonActions.navigate(entry.name, { screen: entry.screen, params: entry.params })
        );
      } else {
        navigationRef.navigate(entry.name, entry.params);
      }
    } catch (e) {
      console.warn('[RootNavigation] queued action failed', entry, e);
    }
  }
}

/**
 * Navigate to a top-level route by name.
 * Queues if navigation not ready.
 */
export function navigate(name, params) {
  if (!name) return;
  if (navigationRef.isReady()) {
    try {
      navigationRef.navigate(name, params);
    } catch (e) {
      console.warn('[RootNavigation] navigate() failed', name, e);
    }
    flushPending();
  } else {
    pending.push({ type: 'navigate', name, params });
    console.warn('[RootNavigation] navigation queued until ready:', name);
  }
}

/**
 * Navigate into a nested navigator: parentName -> { screen: screenName, params }
 * Example: navigateNested('MainTabs', 'Live', { some: 'param' })
 */
export function navigateNested(parentName, screenName, params) {
  if (!parentName || !screenName) return;
  if (navigationRef.isReady()) {
    try {
      navigationRef.dispatch(
        CommonActions.navigate(parentName, { screen: screenName, params })
      );
    } catch (e) {
      console.warn('[RootNavigation] navigateNested dispatch failed', parentName, screenName, e);
    }
    flushPending();
  } else {
    // store a nested navigation request
    pending.push({ type: 'nested', name: parentName, screen: screenName, params });
    console.warn('[RootNavigation] nested navigation queued until ready:', parentName, screenName);
  }
}

/**
 * Generic dispatch
 */
export function dispatch(action) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(action);
    flushPending();
  } else {
    // if it's a navigate-like action, queue it
    if (action?.payload?.name && action?.payload?.screen) {
      // nested-like payload
      pending.push({ type: 'nested', name: action.payload.name, screen: action.payload.screen, params: action.payload.params });
    } else if (action?.payload?.name) {
      pending.push({ type: 'navigate', name: action.payload.name, params: action.payload.params });
    } else {
      console.warn('[RootNavigation] dispatch queued but unknown action:', action);
    }
    console.warn('[RootNavigation] dispatch queued until ready');
  }
}