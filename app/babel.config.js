module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-reanimated/plugin",
      [
        "module-resolver",
        {
          root: ["."],
          alias: {
            "@/components": "./components",
            "@/lib": "./lib",
            "@/navigation": "./navigation",
            "@/scenes": "./scenes",
            "@/constants": "./constants",
            "@/assets": "./assets",
            "@/context": "./context",
          },
        },
      ],
    ],
  };
};
