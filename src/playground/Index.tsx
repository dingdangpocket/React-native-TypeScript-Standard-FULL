import {
  ScreenToParams,
  spreadScreens,
  wrapNavigatorScreen,
} from '@euler/functions';
import { FileUploadProgressDemo } from '@euler/playground/FileUploadProgress';
import { FreeDrawingWithSkia } from '@euler/playground/FreeDrawingWithSkia';
import { FreeDrawingWithSvg } from '@euler/playground/FreeDrawingWithSvg';
import { KeyboardAvoidingViewWithFlexDemo } from '@euler/playground/keyboard-avoiding/WithFlex';
import { KeyboardAvoidingViewWithScrollViewDemo } from '@euler/playground/keyboard-avoiding/WithScrollView';
import { PlaygroundListScreen } from '@euler/playground/Playground';
import { ScorePlaygroundPage } from '@euler/playground/Score';
import { createStackNavigator } from '@react-navigation/stack';

export type PlaygroundNavParams = ScreenToParams<typeof PlaygroundScreens>;

export const PlaygroundScreens = {
  Main: PlaygroundListScreen,
  Score: ScorePlaygroundPage,
  KeyboardAvoidingViewWithScrollViewDemo,
  KeyboardAvoidingViewWithFlexDemo,
  FreeDrawingWithSkia,
  FreeDrawingWithSvg,
  FileUploadProgressDemo,
};

const Stack = createStackNavigator();

export const PlaygroundPage = wrapNavigatorScreen(
  () => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerBackTitleVisible: false,
        }}
      >
        {spreadScreens(Stack.Screen, PlaygroundScreens)}
      </Stack.Navigator>
    );
  },
  { headerShown: false },
);
