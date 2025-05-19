import { Stack } from "expo-router";

export default function HelpLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="helpcenter"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
