import { NavigatorScreenParams } from '@react-navigation/native';

// Auth stack
export type AuthStackParamList = {
  Login: undefined;
};

// Each tab's stack params
export type DashboardStackParamList = {
  DashboardHome: undefined;
};

export type EntryStackParamList = {
  ManualEntry: undefined;
};

export type UploadStackParamList = {
  FileUpload: undefined;
};

export type HistoryStackParamList = {
  HistoryList: undefined;
  EntryDetail: { entryId: string };
};

export type SettingsStackParamList = {
  SettingsHome: undefined;
};

// Main tab navigator
export type MainTabParamList = {
  Dashboard: NavigatorScreenParams<DashboardStackParamList>;
  NewEntry: NavigatorScreenParams<EntryStackParamList>;
  Upload: NavigatorScreenParams<UploadStackParamList>;
  History: NavigatorScreenParams<HistoryStackParamList>;
  Settings: NavigatorScreenParams<SettingsStackParamList>;
};

// Root navigator
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

// Extend the global namespace for type-safe useNavigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
